const AuthService = require('../services/AuthService')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const { verifyEmail, sendRecoverPass } = require('../services/EmailServices')
const { getUserxEmail, setTokenTemporal, verifyEmailToken, RegisterAcept } = require('../services/UserService')
const testConect = async (req, res) => {
	try {
		await AuthService.testConection()
		res.json('Conexión exitosa')
	} catch (error) {
		res.status(400).json(error.message)
	}
}

const login = async (req, res) => {
	try {
		const { email, password, remember } = req.body
		const token = await AuthService.login(email, password, remember)
		return res.status(200).json({ token })
	} catch (error) {
		return res.status(401).json(error.message)
	}
}

const logout = async (req, res) => {
	try {
		res.clearCookie('token')
		res.json({ message: 'Sesión cerrada' })
	} catch (error) {
		res.status(400).json(error.message)
	}
}

const newQuery = async (req, res) => {
	try {
		const users = await AuthService.newQuery()
		res.send(users)
	} catch (error) {
		res.status(401).json(error.message)
	}
}

const register = async (req, res) => {
	try {
		const fullUrl = req.headers.origin
		const { name, last_name, email, email_confirmation, password, password_confirmation, typePerson } = req.body
		const pass = await bcrypt.hash(password, 10)
		const reg = /^(?=.*[A-Z])(?=.*[!@#$%^&*.]).{6,}$/
		if (email !== email_confirmation) throw new Error('Los emails no coinciden')
		if (password !== password_confirmation) throw new Error('Las contraseñas no coinciden')
		if (!reg.test(password)) throw new Error('La contraseña no tiene formato correcto')
		const tokenTemp = crypto.randomBytes(64).toString('hex')
		const data = { email, type_person: typePerson, password: pass, name_register: name, token_temp: tokenTemp }
		if (parseInt(typePerson) === 1) {
			data.last_name_register = last_name
		} else {
			data.last_name_register = ''
		}
		const user = await AuthService.registerUser(data, fullUrl)
		res.status(200).json(user)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

const verifyRegister = async (req, res) => {
	try {
		const { token_temp, id } = req.body
		if (!token_temp || !id) throw new Error('No se enviaron los parametros necesarios')
		const isValidToken = await verifyEmailToken(token_temp, id)
		if (isValidToken.error) throw new Error('El enlace es invalido o ya fue utilizado')
		await RegisterAcept(isValidToken)
		res.status(200).json({ message: 'Se Verifico correctamente el usuario' })
	} catch (error) {
		res.status(400).json(error.message)
	}
}

const password_recover = async (req, res) => {
	try {
		const { email } = req.query
		if (!email) throw new Error('No se enviaron los parametros necesarios')
		const user = await getUserxEmail(email)
		const tokenTemp = await crypto.randomBytes(64).toString('hex')
		// Genero url pra click en email para redireccionar y que cambie la password
		const fullUrl = `${req.protocol}://${req.get('host')}/ChangePassword/${tokenTemp}/${user.id}`
		// Enviar correo electronico con el link para resetear la contraseña
		await sendRecoverPass(user.name, user.email, fullUrl)
		// Guardar en BD el token temporal y su fecha de expiracion
		await setTokenTemporal(user.id, tokenTemp)
		res.status(200).json({ message: `Se ha enviado un mensaje a tu cuenta de correo electrónico`, url: fullUrl })
	} catch (error) {
		res.status(400).json(error.message)
	}
}

module.exports = { login, testConect, register, newQuery, logout, verifyRegister, password_recover }
