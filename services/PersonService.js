const { Association } = require('sequelize')
const { db } = require('../models')
const { personaPorDni } = require('../services/ProcoopService')

// Busca una persona por su número de documento, si no la encuentra la busca en procoop. Si no la encuentra en procoop, devuelve un error.
const getPeopleByNumberDocument = async (number_document, type_person) => {
	try {
		if (type_person === '1') {
			// Traigo la persona de la base de datos y busco la asociacion con la persona fisica
			const person = await db.Person.findOne({
				where: { number_document },
				include: [
					{
						association: 'Person_physical',
					},
				],
			})
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

module.exports = {
	getPeopleByNumberDocument,
}
