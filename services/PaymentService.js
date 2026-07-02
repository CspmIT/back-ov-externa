const axios = require('axios')
const { db } = require('../models')
const { Preference, default: MercadoPagoConfig } = require('mercadopago')

const savePay = async (data, bills) => {
	const t = await db.sequelize.transaction()
	try {
		const pay = await db.Pay.create(data, { transaction: t })
		const details = bills.map((bill) => {
			return {
				id_pay: pay.id,
				description: `Factura ${bill.type} - Periodo ${bill.period}`,
				account: bill.account,
				amount: parseFloat(bill.amount).toFixed(2),
				reference: bill.nrovoucher,
				ss: bill.type.includes('SS') ? 1 : 0,
				cod_com: bill.cod_com,
				suc_com: bill.suc_com,
				num_com: bill.num_com,
			}
		})
		await db.PaysDetail.bulkCreate(details, { transaction: t })
		await t.commit()
		return pay.id
	} catch (error) {
		await t.rollback()
		throw new Error(error)
	}
}

const updatePay = async (id, data) => {
	const t = await db.sequelize.transaction()
	try {
		const pay = await db.Pay.findOne({
			where: {
				id: id,
			},
			include: [
				{
					model: db.PaysDetail,
					as: 'details',
				},
			],
			transaction: t,
		})
		if (!pay) throw new Error('No se encontró el pago')
		await pay.update(data, { transaction: t })
		await t.commit()
		return pay
	} catch (error) {
		await t.rollback()
		throw new Error(error)
	}
}

const enabledMethods = async (id = false) => {
	const query = {
		where: {
			status: 1,
		},
	}
	if (id) {
		query.where.id = id
	}
	return await db.PaysMethods.findAll(query)
}
const payFunCheckout = async (data) => {
	try {
		const paydata = JSON.stringify({
			currency_id: 'ARS',
			external_transaction_id: data.external_id,
			due_date: data.due_date,
			source: {
				type: 'web',
				id: '000001',
				name: 'Oficina Virtual',
			},
			return_url: 'https://payfun.com.ar',
			back_url: 'https://payfun.com.ar',
			notification_url: 'https://desarrollo.coopmorteros.coop/Testjuan/payfun',
			details: data.details,
			payer: {
				name: data.name,
				email: data.mail,
				identification: {
					type: 'DNI_ARG',
					number: data.dni,
					country: 'ARG',
				},
			},
		})

		var config = {
			method: 'post',
			maxBodyLength: Infinity,
			url: 'https://checkouts.payfun.com.ar/v2/checkout',
			headers: {
				'x-api-key': 'MGRjOTY3ZjI0OTg1YTQxYjliNzY3OTBkNDIzYjc1YTJhZDk0NWFiN2Y5ZmRiMjA5',
				'x-access-token': 'MTAyNjc5YWY3YzRmNjQwZjI0OWI4YzYyMmI5ZDMxMDM0YzU4NTU3ZjJhNmE4YTEw',
				'Cache-Control': 'no-cache',
				'Content-Type': 'application/json',
			},
			data: paydata,
		}
		const result = await axios(config)
			.then(function (response) {
				return { status: 1, url: response.data.form_url }
			})
			.catch(function (error) {
				return { status: 0, data: error.response.data.error }
			})
		return result
	} catch (error) {
		throw new Error(error)
	}
}

const MercadoPagoPreference = async (payment) => {
	const dataMp = await enabledMethods(1)
	const accessToken = dataMp[0]?.dataValues?.access_token
	const client = new MercadoPagoConfig({ accessToken })
	const preference = new Preference(client)
	const data = await preference
		.create({
			body: {
				items: [
					{
						title: payment.description,
						quantity: 1,
						unit_price: payment.amount,
					},
				],
				external_reference: payment.external_reference,
				auto_return: 'approved',
				back_urls: {
					success: 'https://cesopol.cooptech.com.ar/paymentStatus/success',
					failure: 'https://cesopol.cooptech.com.ar/paymentStatus/failure',
					pending: 'https://cesopol.cooptech.com.ar/paymentStatus/pending',
				},
			},
		})
		.then((response) => {
			return { status: 1, url: response.id }
		})
		.catch((error) => {
			return { status: 0, data: error.message }
		})

	return data
}

const getVouchersCustomer = async (customer) => {
	try {
		const data = await db.Pay.findAll({
			where: {
				customer: customer,
				status: 1,
			},
			include: [
				{
					model: db.PaysDetail,
					as: 'details',
				},
				{
					model: db.PaysMethods,
					as: 'method',
				},
			],
		})
		return data
	} catch (e) {
		console.log(e)
	}
}

const billPayed = async (bill) => {
	try {
		const data = await db.Pay.findAll({
			where: {
				status: 1,
			},
			include: [
				{
					model: db.PaysDetail,
					as: 'details',
					where: {
						cod_com: bill.COD_COM,
						suc_com: bill.SUC_COM,
						num_com: bill.NUM_COM,
					},
				},
			],
		})
		return data.length > 0
	} catch (e) {
		console.log(e)
	}
}

module.exports = {
	savePay,
	updatePay,
	enabledMethods,
	payFunCheckout,
	MercadoPagoPreference,
	getVouchersCustomer,
	billPayed,
}
