const { serviceCustomer, consumoCustomer, Persona_x_COD_SOC, adheridosSS } = require('../services/ProcoopService.js')
const codes = require('../utils/Procoop/serviceCode.json')

async function customerServices(req, res) {
	try {
		const data = {}
		const { id_procoop } = req.query
		if (!id_procoop) return res.json({ error: 404, msj: 'Usuario no encontrado' })
		const dataSoc = { type: 'COD_SOC', number: id_procoop }
		const services = await serviceCustomer(dataSoc)
		const serviceCodes = codes.SV
		for (let i in services) {
			let typeService = serviceCodes[services[i].COD_SER] || null
			if (!typeService) {
				continue
			}
			if (!data[typeService]) {
				data[typeService] = {}
			}
			if (!data[typeService][services[i].COD_SUM]) {
				data[typeService][services[i].COD_SUM] = {
					address: `${services[i].CALLECUENTA} ${parseInt(services[i].ALTURACALLECUENTA)}`,
					account: services[i].COD_SUM,
					detail: services[i]['NUM_MED/NUMTEL'] ? (typeService === 'TELEFONO' ? 'TEL ' : 'MEDIDOR Nº ') + services[i]['NUM_MED/NUMTEL'] : '',
					status: !services[i].BAJA_ADM ? 1 : 0,
					numService: services[i].COD_SER,
				}
			}
		}
		return res.status(200).json(data)
	} catch (error) {
		console.log(error)
	}
}
async function customerConsumption(req, res) {
	try {
		const { id_procoop } = req.query
		if (!id_procoop) return res.json({ error: 404, msj: 'Usuario no encontrado' })
		const dataSoc = { type: 'COD_SOC', number: id_procoop }
		const services = await serviceCustomer(dataSoc)
		const serviceCodes = codes.SV
		let graphData = { water: { info: {}, data: [], label: [] }, electric: { info: {}, data: [], label: [] } }
		for (let i in services) {
			if (services[i].BAJA_ADM) continue
			let nameService = serviceCodes[services[i].COD_SER] || null
			if (nameService == serviceCodes[6]) {
				var dataSearch = { ser: services[i].COD_SER, account: services[i].COD_SUM }
				var consumpts = await consumoCustomer(dataSearch)
				graphData.water.info = {
					account: services[i].COD_SUM,
					addresse: `${services[i].CALLECUENTA} ${parseInt(services[i].ALTURACALLECUENTA)}`,
					NumMedidor: services[i]['NUM_MED/NUMTEL'],
					difConsumo: parseFloat(consumpts[0].consumo) - parseFloat(consumpts[consumpts.length - 1].consumo),
				}
				for (let j in consumpts) {
					graphData.water.data.push(consumpts[j].consumo)
					graphData.water.label.push(consumpts[j].periodo)
				}
			}
			if (nameService == serviceCodes[1]) {
				var dataSearch = { ser: services[i].COD_SER, account: services[i].COD_SUM }
				var consumpts = await consumoCustomer(dataSearch)
				graphData.electric.info = {
					account: services[i].COD_SUM,
					addresse: `${services[i].CALLECUENTA} ${parseInt(services[i].ALTURACALLECUENTA)}`,
					NumMedidor: services[i]['NUM_MED/NUMTEL'],
					difConsumo: parseFloat(consumpts[0].consumo) - parseFloat(consumpts[consumpts.length - 1].consumo),
				}
				for (let j in consumpts) {
					graphData.electric.data.push(consumpts[j].consumo)
					graphData.electric.label.push(consumpts[j].periodo)
				}
			}
		}
		return res.status(200).json(graphData)
	} catch (error) {
		console.log(error)
	}
}

async function customerServicesDetail(req, res) {
	try {
		const { cod_sum, service } = req.body
		if (!cod_sum || !service) return res.status(500).json({ error: 'Falta información' })
		const serviceCode = codes.SV
		if (!serviceCode[service]) return res.status(500).json({ error: 'Servicio inválido' })
		let result
		switch (serviceCode[service]) {
			case 'ELECTRICIDAD':
				result = await DetailServiceGraf(req.body)
				break
			case 'TV':
				result = await getDataServiceGral(req.body)
				break
			case 'SENSA':
				result = await getDataServiceGral(req.body)
				break
			case 'TELEFONO':
				result = await getDataServiceGral(req.body)
				break
			case 'INTERNET':
				result = await getDataServiceGral(req.body)
				break
			case 'SEPELIO':
				result = await getDataServiceSocial(req.body)
				break
			case 'BANCO DE SANGRE':
				result = await getDataServiceSocial(req.body)
				break
			case 'AGUA':
				result = await DetailServiceGraf(req.body)
				break
			default:
				return res.status(500).json({ error: 'Servicio inválido' })
		}
		return res.status(200).json(result)
	} catch (error) {
		console.log(error)
	}
}

async function getDataServiceGral(req) {
	const dataSoc = { type: 'cod_sum', number: req.cod_sum }
	const services = await serviceCustomer(dataSoc)
	const customer = await Persona_x_COD_SOC(services[0].COD_SOC)
	const serviceCodes = codes.SV
	let dataService = []
	const typeServicerequest = serviceCodes[req.service] || null
	for (let i in services) {
		let typeService = serviceCodes[services[i].COD_SER] || null
		if (!typeService) {
			continue
		}
		if (services[i].cod_ser == req.service || typeService == typeServicerequest) {
			dataService.push({
				account: services[i].COD_SUM,
				service: typeService,
				address: `${services[i].CALLECUENTA} ${parseInt(services[i].ALTURACALLECUENTA)}`,
				nameCustomer: customer[0]?.APELLIDOS ? customer[0].APELLIDOS : customer.procoop_last_name,
				titleService: services[i].DES_SER,
				category: services[i].NOMBRE_CATEGORIA,
				detail: services[i]['NUM_MED/NUMTEL'] ? (typeService === 'TELEFONO' ? 'TEL ' : 'MEDIDOR Nº ') + services[i]['NUM_MED/NUMTEL'] : '',
				status: !services[i].ALTA_ADM ? 2 : !services[i].BAJA_ADM ? 1 : 0,
			})
		}
	}
	return dataService
}

async function DetailServiceGraf(req) {
	const dataServ = await getDataServiceGral(req)
	const dataSearch = { ser: req.service, account: req.cod_sum }
	const consumpts = await consumoCustomer(dataSearch)
	let dataGraf = { data: [], label: [] }
	for (let j in consumpts) {
		dataGraf.data.push(parseFloat(consumpts[j].consumo))
		dataGraf.label.push(consumpts[j].periodo)
	}
	const difConsumo = parseFloat(consumpts[0].consumo) - parseFloat(consumpts[consumpts.length - 1].consumo)
	const DataServiceElectric = {
		generalData: dataServ,
		difCosumo: difConsumo,
		graficData: dataGraf,
	}
	return DataServiceElectric
}

async function getDataServiceSocial(req) {
	const dataServ = await getDataServiceGral(req)
	const serviceCodes = codes.SV
	const service = serviceCodes[req.service] == 'SEPELIO' ? [4, 90] : [3, 89]
	const dataSearch = { ser: service, account: req.cod_sum }
	const IncreasedService = await adheridosSS(dataSearch)
	let dataAdherido = []
	for (let data of IncreasedService) {
		dataAdherido.push({
			name: data.apellidos || '',
			category: data.des_vin || '',
			dni: data.num_dni || '',
			groupBlood: data.gru_sgr || '',
			burn: data.fec_nac || '',
		})
	}
	const datosSS = {
		generalData: dataServ,
		adheridos: dataAdherido,
	}
	return datosSS
}

module.exports = {
	customerServices,
	customerConsumption,
	customerServicesDetail,
}
