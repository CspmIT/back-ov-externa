const { getIo } = require('../config/sockets')
const { payFunCheckout, enabledMethods, savePay, MercadoPagoPreference } = require('../services/PaymentService')
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
	enviarNoti,
}
