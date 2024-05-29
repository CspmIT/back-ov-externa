const { db } = require('../models')

const createRequestService = async (userID, services) => {
	const t = await db.sequelize.transaction()
	try {
		const serviceRequest = {
			id_user: userID,
			status: 1,
		}
		const requestService = await db.Service_Request.create(serviceRequest, { transaction: t })

		const servicesToSave = services
			.filter((service) => service.tipo !== 0)
			.map((service) => ({
				id_service_request: requestService.id,
				id_service_form: 1,
				service_type: service.tipo,
				status: 1,
				service_name: service.nombre,
			}))

		await db.Service_Items.bulkCreate(servicesToSave, { transaction: t })

		await t.commit()

		return requestService
	} catch (error) {
		await t.rollback()
		throw error
	}
}

const getRequestServiceByUser = async (userID) => {
	const requests = await db.Service_Request.findAll({
		where: { id_user: userID },
		include: [
			{
				association: 'ServiceItems',
			},
		],
	})

	return requests
}

module.exports = { createRequestService, getRequestServiceByUser }
