const { getPeopleByNumberDocument, newOrUpdatePeople } = require('../services/PersonService')

const peopleByDocumentNumber = async (req, res) => {
	try {
		const { number_document, type_person } = req.body
		const person = await getPeopleByNumberDocument(number_document, type_person)
		res.status(200).json(person)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

const createOrUpdatePeople = async (req, res) => {
	const { person } = req.body
	const people = {
		id: person.id,
		email: person.email,
		type_person: person.type_person,
		situation_tax: person.COD_SIT,
		fixed_phone: `${person.caracteristicaFijo} ${person.numeroFijo}`,
		cell_phone: `${person.characteristic} ${person.number}`,
		type_document: person.TIP_DNI,
		number_document: person.NUM_DNI,
	}
	if (person?.type_person === '1') {
		const person_physical = {
			id_person: person.id,
			name: person.name,
			last_name: person.last_name,
			type_dni: person.TIP_DNI,
			num_dni: person.NUM_DNI,
			born_date: `${person.año}-${person.mes}-${person.dia}`,
			id_type_sex: person.SEXO,
		}
	}
	const savePerson = res.status(200).json({ message: 'ok', person })
}

module.exports = {
	peopleByDocumentNumber,
	createOrUpdatePeople,
}
