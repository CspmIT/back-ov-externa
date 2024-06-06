const { db } = require('../models')
const { personaPorDni } = require('../services/ProcoopService')

// Busca una persona por su número de documento, si no la encuentra la busca en procoop. Si no la encuentra en procoop, devuelve un error.
const getPeopleByNumberDocument = async (number_document, type_person) => {
	try {
		if (type_person === '1') {
			const person = await db.Person.findOne({ where: { number_document } })
			if (!person) {
				const procoopPerson = await personaPorDni(number_document)
				if (!procoopPerson) {
					throw new Error('Persona no encontrada')
				}
				return procoopPerson
			}
			return person
		}
	} catch (error) {
		throw error
	}
}
const savePerson = async (PersonData) => {
	return db.sequelize.transaction(async (t) => {
		try {
			const [Person, created] = await db.Person.findOrCreate({ where: { id: PersonData.id }, defaults: { ...PersonData }, transaction: t })
			if (!created) {
				await Person.update(PersonData, { transaction: t })
			}
			return Person
		} catch (error) {
			throw error
		}
	})
}
const savePersonPhysical = async (PersonData) => {
	return db.sequelize.transaction(async (t) => {
		try {
			const [Person_physical, created] = await db.Person_physical.findOrCreate({ where: { id_person: PersonData.id_person }, defaults: { ...PersonData }, transaction: t })
			if (!created) {
				await Person_physical.update(PersonData, { transaction: t })
			}
			return Person_physical
		} catch (error) {
			throw error
		}
	})
}
const savePersonLegal = async (PersonData) => {
	return db.sequelize.transaction(async (t) => {
		try {
			const [Person_legal, created] = await db.Person_legal.findOrCreate({ where: { id_person: PersonData.id_person }, defaults: { ...PersonData }, transaction: t })
			if (!created) {
				await Person_legal.update(PersonData, { transaction: t })
			}
			return Person_legal
		} catch (error) {
			throw error
		}
	})
}
module.exports = {
	getPeopleByNumberDocument,
	savePerson,
	savePersonPhysical,
	savePersonLegal,
}
