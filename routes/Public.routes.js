const express = require('express')
const os = require('os')
const router = express.Router()
const { tokenVerify, usersRegistered } = require('../controllers/User.controller')
// const { migrator1Up } = require('../controllers/migrations.controller')
const { login, testConect, register, verifyRecoverToken, verifyRegister, password_recover, changePassword } = require('../controllers/Auth.controller')
const { customerServices, customerConsumption } = require('../controllers/Services.controller')
const { getInvoice, existInvoice } = require('../controllers/Invoice.controller')
const { searchByDNI, searchByCuit, migrationCity, migrationState, testConectOncativo, oncativoUser } = require('../controllers/Procoop.controller')
const { Commentaries, addCommentary, Popups, addPopup, addInformation, Informations, addImageInformation, ImageInformations } = require('../controllers/Managment.controller')
const { relationUserCooptech, loginCooptech, tokenCooptech } = require('../controllers/Cooptech.controller')
const { paymentMercadoPago } = require('../controllers/Payment.controller')

// RUTAS PARA AUTH

router.post('/generateTokenCooptech', tokenCooptech)
router.post('/loginCooptech', loginCooptech)
router.post('/login', login)
router.post('/register', register)
router.post('/changePassword', changePassword)
router.post('/validationUser', verifyRegister)
router.post('/validationToken', verifyRecoverToken)
router.post('/password_recover', password_recover)
router.post('/existToken', tokenVerify)

// RUTAS PARA COOPTECH
router.post('/relationUserCooptech', relationUserCooptech)
router.post('/existEmailOfivir', existEmailOfivir)

router.get('/connectOncativo', testConectOncativo)
router.get('/userOncativo', oncativoUser)
// router.get('/users', migrationUser)
// router.get('/email', sendEmail)

//RUTAS DE SERVICIOS
router.get('/getService', customerServices)
router.get('/getConsumo', customerConsumption)

//RUTAS DE PAGOS
router.get('/facturas', getInvoice)
router.get('/existinvoice', existInvoice)
// router.get('/pruebaMigration', migrator1Up)
// router.get('/MigrationLocation', migrationCity)

router.get('/testConect', testConect)
router.post('/searchDni', searchByDNI)
router.post('/searchCuit', searchByCuit)

//RUTAS INTERNAS
router.get('/Commentaries', Commentaries)
router.get('/getPopups', Popups)
router.post('/addPopup', addPopup)
router.post('/addInformation', addInformation)
router.get('/informations', Informations)
router.post('/addImageInformation', addImageInformation)
router.get('/imageInformations', ImageInformations)
router.get('/getUsersRegistered', usersRegistered)

router.get('/mercadopago', paymentMercadoPago)

router.get('/getIp', (req, res) => {
	const networkInterfaces = os.networkInterfaces()
	let containerIP = 'IP no encontrada'

	for (const interfaceName in networkInterfaces) {
		const addresses = networkInterfaces[interfaceName]
		for (const address of addresses) {
			if (address.family === 'IPv4' && !address.internal) {
				containerIP = address.address
				break
			}
		}
	}

	res.json({ ip: containerIP })
})
module.exports = router
