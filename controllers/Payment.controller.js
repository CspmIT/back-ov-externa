const { default: MercadoPagoConfig, Payment } = require('mercadopago')
const { getIo } = require('../config/sockets')
const { payFunCheckout, enabledMethods, savePay, MercadoPagoPreference, getVouchersCustomer } = require('../services/PaymentService')
const { getProfileUser } = require('../services/UserService')

const paymentMethods = async (req, res) => {
	try {
		const result = await enabledMethods()
		return res.status(200).json(result)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

const payLink = async (req, res) => {
	try {
		const data = req.body
		if (data.bills.length === 0) return res.status(400).json({ status: 0, data: 'No se seleccionaron facturas para pagar' })
		let result
		const pay = {
			id_user: req.user.id,
			customer: data.account.num,
			name_customer: data.account.name,
			total: data.total,
			id_method: data.method,
			status: 0,
		}
		req.id_pay = await savePay(pay, data.bills)
		switch (data.method) {
			case 1:
				result = await paymentMercadoPago(req)
				break
			case 2:
				result = await paymentPayFun(req)
				break
			default:
				result = { status: 0, data: 'Method not found' }
				break
		}
		return res.status(result.status === 1 ? 200 : 400).json(result)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

const paymentMercadoPago = async (req) => {
	try {
		const { bills } = req.body
		let oldPeriod = bills[0].period
		let newPeriod = bills[0].period

		bills.forEach((bill) => {
			const periodValue = bill.period.split('/').reverse().join('') // Convertir mm/YYYY a YYYYmm para comparación
			if (periodValue < oldPeriod.split('/').reverse().join('')) oldPeriod = bill.period
			if (periodValue > newPeriod.split('/').reverse().join('')) newPeriod = bill.period
		})

		const description = 'Facturas periodo' + (oldPeriod === newPeriod ? ` ${oldPeriod}` : `s ${oldPeriod} a ${newPeriod}`)
		const data = {
			description,
			amount: req.body.total,
			external_reference: req.id_pay,
		}
		const payment = await MercadoPagoPreference(data)
		return payment
	} catch (error) {
		return { status: 0, data: error.message, type: 'api' }
	}
}

const paymentPayFun = async (req) => {
	try {
		// PASO LAS FACTURAS EN EL FORMATO PEDIDO POR PAYFUN
		const details = []
		const { bills } = req.body
		bills.map((bill) => {
			const amount = parseFloat(bill.amount).toFixed(2)
			details.push({
				external_reference: bill.nrovoucher,
				concept_description: `Factura ${bill.type} - Periodo ${bill.period}`,
				amount: amount.toString(),
			})
		})
		// ESTABLEZCO FECHA DE VENCIMIENTO CON LA ZONA HORARIA PEDIDA POR PAYFUN
		const date = new Date()
		date.setDate(date.getDate() + 1)
		const offset = 180
		date.setMinutes(date.getMinutes() - offset)
		const formattedDate = date.toISOString().replace('.000Z', '-0300')
		// FIN DE ESTABLECIMIENTO DE FECHA
		const user = await getProfileUser(req.user.id)
		const data = {
			external_id: `OV-${req.id_pay.toString().padStart(6, '0')}`,
			name: user.name_register.toUpperCase() + ' ' + user.last_name_register.toUpperCase(),
			dni: user.PersonData.dataValues.number_document,
			mail: user.PersonData.dataValues.email,
			due_date: formattedDate,
			details,
		}
		return await payFunCheckout(data)
	} catch (error) {
		return { status: 0, data: error.message, type: 'api' }
	}
}

const voucherCustomer = async (req, res) => {
	try {
		const { customer } = req.query
		const data = await getVouchersCustomer(customer)
		return res.status(200).json(data)
	} catch (e) {
		console.log(e)
	}
}

const webhookResponse = async (req, res) => {
	const xSignature = req.headers['x-signature']
	const xRequestId = req.headers['x-request-id']
	const queryParams = req.query
	const dataID = queryParams.data_id
	const parts = xSignature.split(',')
	let ts = null
	let hash = null
	parts.forEach((part) => {
		const [key, value] = part.split('=')
		if (key === 'ts') ts = value
		if (key === 'v1') hash = value
	})
	const secret = 'ba33249d2d35765461945b23b56afee086bcdd90ab516dd9229fc761712d40df'
	const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`
	const sha = require('crypto').createHmac('sha256', secret).update(manifest).digest('hex')
	if (sha === hash) {
		payCancelMp(dataID)
	}
}

const payCancelMp = async (req, res) => {
	try {
		const dataId = 104535527709
		const client = new MercadoPagoConfig({
			accessToken: 'APP_USR-6180028893273834-012912-e4718b99fcaffd255c9b825a6ab3cfe5-1649301439',
		})
		const payment = new Payment(client)
		const paymentData = await payment.capture({ id: dataId })
		return res.status(200).json(paymentData)
	} catch (e) {
		return res.status(400).json(e)
	}
}

const enviarNoti = async (req, res) => {
	try {
		const io = getIo()
		// Tu lógica para preparar el mensaje
		const message = {
			status: 1,
			type: 'notification',
			message: 'Pagado con exito',
		}

		// Emitir el mensaje a todos los clientes conectados
		io.emit('payment', message)
		res.status(200).json('Hola')
	} catch (error) {
		res.status(400).json(error.message)
	}
}

module.exports = {
	paymentMethods,
	payLink,
	paymentMercadoPago,
	voucherCustomer,
	webhookResponse,
	enviarNoti,
	payCancelMp,
}
