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
	if (body) {
		query.where = { level: body.level,   date_out: { '>=': body.date_start}, status: 0}
	}
	if (id) {
		query.where = { id }
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

async function getInformation() {
	return await db.Information.findAll()
}

async function saveInformation(information) {
	return await db.Information.create(information)
}

module.exports = {
	getCommentaries,
	saveCommentary,
}
