const { getCommentaries, saveCommentary, savePopup, getPopup, saveInformation, getInformation} = require('../services/ManagmentService')

async function Commentaries(req, res) {
	try {
		const commentaries = await getCommentaries()
		res.status(200).json(commentaries)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

async function addCommentary(req, res) {
	try {
		const commentary = req.body
		const {id} = req.user;
		commentary.id_user = id;
		const newCommentary = await saveCommentary(commentary)
		res.status(200).json(newCommentary)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

async function addPopup(req, res) {
	try {
		const popup = req.body
		const existePopup = await getPopup(popup)
		if(existePopup.length > 0){
			res.status(200).json(['existeModal'])
		}
		const newPopup = await savePopup(popup)
		res.status(200).json(newPopup)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

async function Popups(req, res) {
	try {
		const id = req.query.id || false
		const popups = await getPopup()
		res.status(200).json(popups)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

async function addInformation(req, res) {
	try {
		const information = req.body
		const newInformation = await saveInformation(information)
		res.status(200).json(newInformation)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

async function Informations(req, res) {
	try {
		const informations = await getInformation()
		res.status(200).json(informations)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

module.exports = {
	Commentaries,
	addCommentary,
	addPopup,
	Popups, 
	Informations, 
	addInformation
}
