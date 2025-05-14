const express = require('express')
const os = require('os')
const router = express.Router()
const { tokenVerify } = require('../controllers/User.controller')
// const { migrator1Up } = require('../controllers/migrations.controller')
const { login, testConect, register, verifyRecoverToken, verifyRegister, password_recover, changePassword } = require('../controllers/Auth.controller')
// const { customerConsumption } = require('../controllers/Services.controller')
const { getInvoice, existInvoice } = require('../controllers/Invoice.controller')
const { searchByDNI, searchByCuit, migrationCity, migrationState, testConectOncativo } = require('../controllers/Procoop.controller')

const { paymentMercadoPago, webhookResponse } = require('../controllers/Payment.controller')

// RUTAS PARA AUTH
router.post('/login', login)
router.post('/register', register)
router.post('/changePassword', changePassword)
router.post('/validationUser', verifyRegister)
router.post('/validationToken', verifyRecoverToken)
router.post('/password_recover', password_recover)
router.post('/existToken', tokenVerify)

// RUTAS PARA COOPTECH

router.get('/status', testConectOncativo)

//RUTAS DE PAGOS
router.get('/facturas', getInvoice)
router.get('/existinvoice', existInvoice)

router.get('/testConect', testConect)
router.post('/searchDni', searchByDNI)
router.post('/searchCuit', searchByCuit)

//RUTAS INTERNAS
router.get('/mercadopago', paymentMercadoPago)
router.post('/pagoRealizado', webhookResponse)

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
