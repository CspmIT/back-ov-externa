const { createRequestService, getRequestServiceByUser, getRequestServiceData, updateRequestService } = require('../services/ServiceRequestService')

const newRequestService = async (req, res) => {
	try {
		const { services } = req.body
		const { id } = req.user
		const result = await createRequestService(id, services)
		res.status(200).json(result)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

const getRequestsByUser = async (req, res) => {
	try {
		const { id } = req.user
		const requests = await getRequestServiceByUser(id)
		res.status(200).json(requests)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

const updateServiceRequest = async (req, res) => {
	try {
		const data = req.body
		console.log(data)
		return
		const result = await updateRequestService(data)
		res.status(200).json(result)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

const getRequestsData = async (req, res) => {
	try {
		const { requestID } = req.body
		const result = await getRequestServiceData(requestID)

		if (result && result.ServiceItems) {
			result.ServiceItems = result.ServiceItems.map((item) => {
				return {
					id: item.id,
					id_service_request: item.id_service_request,
					id_service_form: item.id_service_form,
					service_type: item.service_type,
					status: item.status,
					cod_sum: item.cod_sum,
					service_name: item.service_name,
				}
			})
		}
		res.status(200).json(result)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

const getFormService = async (req, res) => {
	try {
		const { formID, type } = req.body
		if (type === 1) {
			// const form = await db.ServiceForm.findByPk(formID)
			res.status(200).json({ datos: 'energia electrica' })
		}
		if (type === 2) {
			// const form = await db.ServiceForm2.findByPk(formID)
			res.status(200).json({ datos: 'agua potable' })
		}
		if (type === 3) {
			// const form = await db.ServiceForm3.findByPk(formID)
			res.status(200).json({ datos: 'telecomunicaciones' })
		}
		if (type === 4) {
			// const form = await db.ServiceForm4.findByPk(formID)
			res.status(200).json({ datos: 'servicios sociales' })
		}
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

module.exports = { newRequestService, getRequestsByUser, updateServiceRequest, getRequestsData, getFormService }
