const { db } = require('../models')

async function getCommentaries(id = false) {
	const query = {
		include: [
			{
				model: db.User,
				as: 'User',
				attributes: ['name_register', 'last_name_register', 'email'],
			},
		],
	}

	if (id) {
		query.where = { id_user: id }
	}

	return await db.Commentary.findAll(query)
}

async function saveCommentary(commentary) {
	return await db.Commentary.create(commentary)
}

async function getPopup(body = false, id = false) {
	const query = {}
	if (id) {
		query.where = { id }
	}else{
		if (body) {
			query.where = { level: body.level,   date_out: { '>=': body.date_start}, status: 0}
		}
	}
	return await db.PopUp.findAll(query)
}

async function savePopup(popup) {
	if (popup.id) {
		return await db.PopUp.update(popup, {
			where: { id: popup.id },
		})
	} else {
		return await db.PopUp.create(popup)
	}
}

async function getInformation(id = false) {
	const query = {}
	if (id) {
		query.where = { id }
	}
	return await db.Information.findAll(query)
}

async function saveInformation(information) {
	if (information.id) {
		return await db.Information.update(information, {
			where: { id: information.id },
		})
	} else {
		return await db.Information.create(information)
	}
}

async function getImageInformation(idInformation = false) {
	const query = {}
	if (idInformation) {
		query.where = { id_information: idInformation }
	}
	return await db.Image_Information.findAll(query)
}

async function saveImageInformation(ImageInformation) {
	return await db.Image_Information.create(ImageInformation)
}

module.exports = {
	getCommentaries,
	saveCommentary,
	getPopup, 
	savePopup, 
	getInformation, 
	saveInformation,
	getImageInformation,
	saveImageInformation
}
