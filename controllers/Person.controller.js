const { getPeopleByNumberDocument } = require('../services/PersonService')

const peopleByDocumentNumber = async (req, res) => {
	try {
		console.log(req.body)
		const { number_document, type_person } = req.body
		const person = await getPeopleByNumberDocument(number_document, type_person)
		res.status(200).json(person)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

module.exports = {
	peopleByDocumentNumber,
}
