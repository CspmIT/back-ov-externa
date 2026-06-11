const axios = require('axios')
const { db } = require('../models/index.js')
const { debtsCustomer, phoneCustomer, accountsCustomer } = require('../services/ProcoopService.js')
const codes = require('../utils/Procoop/serviceCode.json')
const { billPayed } = require('../services/PaymentService.js')

async function getInvoice(req, res) {
	try {
		const { id_procoop } = req.query
		const all = req.query.all ? true : false
		const today = new Date()
		let debts = []
		if (all) {
			const accounts = await accountsCustomer(id_procoop)
			if (!accounts || accounts.length === 0) {
				return res.status(404).json({ message: 'Error al buscar los datos' })
			}
			// Agregar cada account
			const accountsArray = accounts.map((account) => account.COD_SUM)
			debts = await debtsCustomer(accountsArray, all)
			if (!debts) {
				return res.status(404).json({ message: 'Error al buscar los datos' })
			}
		} else {
			const data = await axios.get(`https://cesopol-procoop.arreg.la/api/FacturasGeneral/GetInfoDeudaSocio/${id_procoop}`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'proc00pkey-4tkmwyzggj-Coop-371',
				},
			})
			if (data.status === 200 && data.data.length > 0) {
				debts = data.data.map((debt) => {
					const saldo = parseFloat(debt.saldo) || 0
					const recargo = parseFloat(debt.monto_recargo) || 0
					return {
						ID_FAC: debt.id_fac,
						COD_COM: debt.cod_com,
						SUC_COM: debt.suc_com,
						NUM_COM: debt.num_com,
						TIPO: debt.tipo,
						VTO1: debt.vto1,
						VTO2: debt.vto2,
						VENCIMIENTO: debt.vencimiento,
						COD_SUM: debt.cod_sum,
						PERIODO: debt.periodo,
						SALDO: saldo,
						AMOUNT: saldo + recargo,
						NUMERO: debt.numero_talon,
						DEB_CRE: 1,
					}
				})
			}
		}
		let invoices = {}
		let phone = ''
		const typeInvoice = codes.TF
		for (let i in debts) {
			if (!invoices[debts[i].COD_SUM]) {
				phone = ''
				invoices[debts[i].COD_SUM] = { data: {}, list: [] }
				phone = await phoneCustomer(debts[i].COD_SUM)
				var numberPhone = phone.error ? '' : phone[0]['NUM_MED/NUMTEL']
				invoices[debts[i].COD_SUM].data = {
					phoneNumber: numberPhone,
					account: debts[i].COD_SUM,
				}
			}
			if (debts[i].DEB_CRE !== 1) continue

			var vto = debts[i].VENCIMIENTO ? debts[i].VENCIMIENTO : today > new Date(debts[i].VTO1) ? debts[i].VTO2 : debts[i].VTO1
			var total = debts[i].AMOUNT !== undefined ? debts[i].AMOUNT : today > new Date(debts[i].VTO1) ? debts[i].TOTAL2 : debts[i].TOTAL1
			var pdf = debts[i]['COD_SUM'].toString().padStart(6, '0') + debts[i]['COD_COM'].toString().padStart(4, '0') + debts[i]['SUC_COM'].toString().padStart(4, '0') + debts[i]['NUM_COM'].toString().padStart(8, '0')
			var voucher = `${typeInvoice[debts[i].COD_COM] || 'CSB'}-${debts[i]['SUC_COM'].toString().padStart(4, '0')}-${debts[i]['NUM_COM'].toString().padStart(8, '0')}`
			var invoiceExists = false
			if (debts[i].NUMERO) {
				for (let j in invoices[debts[i].COD_SUM].list) {
					if (invoices[debts[i].COD_SUM].list[j].number && invoices[debts[i].COD_SUM].list[j].number === debts[i].NUMERO) {
						invoiceExists = true
						invoices[debts[i].COD_SUM].list[j].type = debts[i].TIPO === 'EN' ? `EN-${invoices[debts[i].COD_SUM].list[j].type}` : `${invoices[debts[i].COD_SUM].list[j].type}-${debts[i].TIPO}`
						invoices[debts[i].COD_SUM].list[j].nrovoucher = voucher
						invoices[debts[i].COD_SUM].list[j].url = debts[i].TIPO === 'EN' ? `https://oficinavirtual.oncativo.dc.cspm.net.ar/${pdf}.pdf` : invoices[debts[i].COD_SUM].list[j].url
						//invoices[debts[i].COD_SUM].list[j].url = debts[i].TIPO === 'EN' ? debts[i].ID_FAC : invoices[debts[i].COD_SUM].list[j].url
						invoices[debts[i].COD_SUM].list[j].amount = parseFloat(invoices[debts[i].COD_SUM].list[j].amount) + parseFloat(total)
						//invoices[debts[i].COD_SUM].list[j].amount = parseFloat(parseFloat(invoices[debts[i].COD_SUM].list[j].amount) + parseFloat(total)).toFixed(2)
						break
					}
				}
			}
			if (!invoiceExists) {
				var status
				if (parseInt(debts[i].SALDO) > 0) {
					status = 0
				}
				var isPayed = await billPayed(debts[i])
				status = isPayed ? 2 : status
				var fact = {
					id: debts[i].ID_FAC,
					type: debts[i].TIPO,
					nrovoucher: voucher,
					period: debts[i].PERIODO,
					vto: vto,
					amount: total,
					url: `https://oficinavirtual.oncativo.dc.cspm.net.ar/${pdf}.pdf`,
					status: status,
					number: debts[i].NUMERO,
					cod_com: debts[i].COD_COM,
					suc_com: debts[i].SUC_COM,
					num_com: debts[i].NUM_COM,
					checkbox: status === 2 ? false : true,
				}
				invoices[debts[i].COD_SUM].list.push(fact)
			}
		}

		return res.status(200).json(invoices)
	} catch (error) {
		return res.status(400).json({ message: error })
	}
}

async function existInvoice(req, res) {
	try {
		const { url } = req.query
		const timeout = 5000
		const response = await axios.head(url, { timeout })
		const status = {
			status: response.status >= 200 && response.status < 300 ? 'existe' : 'falla',
		}
		const code = status.status === 'existe' ? 200 : 404
		return res.status(code).json(status)
	} catch (error) {
		return res.status(404).json({ status: 'falla' })
	}
}

module.exports = {
	getInvoice,
	existInvoice,
}
