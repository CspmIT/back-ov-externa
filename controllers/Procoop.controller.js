const City = require('../models/city.js')
const { db } = require('../models/index.js')
const State = require('../models/state.js')
const { ListCityProcoop, ListStateProcoop, empresaPorCuit, personaPorDni, Persona_x_COD_SOC, getOrCreateUser_ProcoopMember, getOrCreateProcoopMember } = require('../services/ProcoopService.js')
const { updatePrimaryAccountUserProcoop, deleteUserPersonMember } = require('../services/UserService.js')
const { addStreet } = require('../services/locationServices.js')

async function searchByDNI(req, res) {
	const { dni } = req.body
	try {
		const result = await personaPorDni(dni)
		return res.status(200).json(result)
	} catch (error) {
		return res.status(400).json({ error, msj: error.messagge })
	}
}

async function searchByCuit(req, res) {
	const { cuit } = req.body
	try {
		const result = await empresaPorCuit(cuit)
		return res.status(200).json(result)
	} catch (error) {
		return res.json({ error, msj: 'error' })
	}
}

async function migrationCity(req, res) {
	try {
		const listCities = await ListCityProcoop()
		let citiesOfi = []
		if (listCities) {
			citiesOfi = await listCities.map((item) => {
				return { cod_loc: item.COD_LOC, des_loc: item.DES_LOC, cod_pos: item.COD_POS, cod_pci: item.COD_PCI }
			})
		}
		const resultadd = await db.City.bulkCreate(citiesOfi)
		return res.status(200).json(resultadd)
	} catch (error) {
		return res.json({ error, msj: 'error' })
	}
}
async function migrationState(req, res) {
	try {
		const ListStates = await ListStateProcoop()
		let listStateOfi = []

		if (ListStates) {
			listStateOfi = await ListStates.map((item) => {
				return { cod_pro: item.COD_PRO, des_pro: item.DES_PRO, cod_afip: item.COD_AFIP }
			})
		}
		const resultado = await db.State.bulkCreate(listStateOfi)
		return res.status(200).json(resultado)
	} catch (error) {
		console.log(error)
		return res.json({ error, msj: error })
	}
}
async function getNameCustomer(req, res) {
	try {
		const { customer } = req.body
		const result = await Persona_x_COD_SOC(customer)
		return res.status(200).json(result)
	} catch (error) {
		return res.status(400).json({ message: error.message })
	}
	// Persona_x_COD_SOC
}
async function addUserPersonMember(req, res) {
	try {
		const { customer } = req.body
		const { id } = req.user
		const ProcoopMember = await getOrCreateProcoopMember(customer, req.user)
		const relationUserProcoopMember = await getOrCreateUser_ProcoopMember(ProcoopMember.id, id)
		const dataResult = {
			id_relation: relationUserProcoopMember.id,
			name: ProcoopMember.last_name,
			num: ProcoopMember.number_customer,
			primary: relationUserProcoopMember.primary_account,
			level: relationUserProcoopMember.level,
		}
		return res.status(200).json(dataResult)
	} catch (error) {
		return res.status(404).json({ message: error.message })
	}
	// Persona_x_COD_SOC
}
async function removeUserPersonMember(req, res) {
	try {
		const { id_relation } = req.query
		const relationUserProcoopMember = await deleteUserPersonMember(id_relation)
		return res.status(200).json(relationUserProcoopMember)
	} catch (error) {
		return res.status(404).json({ message: error.message })
	}
}
async function changePrimaryAccountUserProcoop(req, res) {
	try {
		const { id_relation } = req.query
		const { id } = req.user
		const relationUserProcoopMember = await updatePrimaryAccountUserProcoop(id_relation, id)
		return res.status(200).json(relationUserProcoopMember)
	} catch (error) {
		return res.status(404).json(error.message)
	}
}

module.exports = {
	searchByCuit,
	searchByDNI,
	migrationCity,
	migrationState,
	getNameCustomer,
	addUserPersonMember,
	removeUserPersonMember,
	changePrimaryAccountUserProcoop,
}
