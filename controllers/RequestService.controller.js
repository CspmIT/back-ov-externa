const {
    createRequestService,
    getRequestServiceByUser,
    getRequestServiceData,
    updateRequestService,
    returnLaterService,
    saveFirstStepData,
    getServiceFormByServiceRequest,
    saveElectricalDataForm,
    saveWaterDataForm,
} = require('../services/ServiceRequestService')
const {
    PersonDataSchema,
    PersonRequestSchema,
} = require('../schemas/RequestService/person.schema')
const {
    electricFormSchema,
} = require('../schemas/RequestService/electricPower.schema')
const {
    ConnectionAddressSchema,
} = require('../schemas/RequestService/ConnectionAddress.schema')

const newRequestService = async (req, res) => {
    try {
        const { services } = req.body
        const { id } = req.user
        const result = await createRequestService(id, services)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
    47
}

// !Metodo inutilizado
const savePersonalData = async (req, res) => {
    try {
        const { id } = req.user
        const { person, serviceRequest } = req.body
        const response = PersonDataSchema.safeParse(person)

        if (!response.success) {
            throw new Error(response.error.issues.map((error) => error.message))
        }
        // const result = await createOrUpdatePeople(id, data);
        res.status(200).json(response.data)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

// ! PENDIENTE DESPUES DE FINALIZAR TODOS LOS GUARDADOS DE LOS DEMAS SERVICIOS
const returnLater = async (req, res) => {
    try {
        const { id } = req.user
        // Debo recibir currentStep, Services y los datos del formulario actual.
        const { AllData, ServiceForm } = req.body
        console.log(req.body)
        if (!id) throw new Error('No tienes permisos para hacer esta accion')

        /* 
            POSIBLES SERVICIOS A GUARDAR:
            Siempre se guarda el servicio actual. Los servicios anteriores se guardan al dar siguiente en el formulario
            por lo que no es necesario guardarlos en este punto.

            Determinar cual es el servicio actual y guardar utilizando la funcion de ese servicio especifico.
        */

        res.status(200).json({
            message: 'Solicitud guardada para continuar más tarde',
            data: result,
        })
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({ message: error.message })
    }
}

// Guardado
const firstStepData = async (req, res) => {
    try {
        const { id } = req.user
        const { person, serviceRequest } = req.body
        const isValid = PersonRequestSchema.safeParse(person)
        if (!isValid.success) {
            throw new Error(isValid.error.issues.map((error) => error.message))
        }
        const result = await saveFirstStepData(id, person, serviceRequest)
        res.status(200).json({
            message: 'Datos guardados correctamente',
            data: result,
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.message })
    }
}
const getFormID = async (serviceRequestID, serviceType) => {
    const serviceForm = await getServiceFormByServiceRequest(
        serviceRequestID,
        serviceType
    )

    return serviceForm[0].dataValues.id_service_form
}

// Guardado para el formulario de energia electrica
const electricFormData = async (req, res) => {
    try {
        const { id } = req.user
        const { serviceRequest, form_data, connection_address_tmp } = req.body
        if (!serviceRequest || !form_data || !connection_address_tmp)
            throw new Error('Faltan datos para realizar la consulta')
        if (!id) throw new Error('No tienes permisos para hacer esta accion')

        //Obtengo el id del formulario del servicio
        const idServiceForm = await getFormID(serviceRequest.id, 1)
        form_data.id_service_form = idServiceForm

        const validFormData = electricFormSchema.safeParse(form_data)
        if (!validFormData.success) {
            throw new Error(
                validFormData.error.issues.map((error) => error.message)
            )
        }
        // Valido si es el ultimo paso
        if (await isFinalStep(serviceRequest.id, serviceRequest.step)) {
            // Si es el ultimo paso actualizo el status de serviceRequest a 1
            serviceRequest.status = 1
        }

        const validConnectionAddress = ConnectionAddressSchema.safeParse(
            connection_address_tmp
        )
        if (!validConnectionAddress.success) {
            throw new Error(
                validConnectionAddress.error.issues.map(
                    (error) => error.message
                )
            )
        }

        const result = await saveElectricalDataForm(
            serviceRequest,
            validFormData.data,
            validConnectionAddress.data
        )
        if (!result) throw new Error('Error al guardar los datos')
        res.status(200).json({
            message: 'Datos guardados correctamente',
            data: validFormData.data,
            connection: validConnectionAddress.data,
        })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

// Guardado para el formulario de agua potable
const waterFormData = async (req, res) => {
    const { serviceRequest, form_data, connection_address_tmp } = req.body
    const { id } = req.user
    try {
        if (!id) throw new Error('No tienes permisos para hacer esta accion')
        if (!serviceRequest || !form_data || !connection_address_tmp)
            throw new Error('Faltan datos para continuar')
        //Obtengo el id del formulario del servicio
        const idServiceForm = await getFormID(serviceRequest.id, 2)
        form_data.id_service_form = idServiceForm

        // console.log(serviceForm)

        if (await isFinalStep(serviceRequest.id, serviceRequest.step)) {
            console.log('Entra en el if')
            // Si es el ultimo paso actualizo el status de serviceRequest a 1
            serviceRequest.status = 1
        }

        if (!form_data.sameDirection) {
            console.log('usa la misma direccion')
            // Valido que llege connectionstate
            if (!form_data.connectionState)
                throw new Error('Debe indicar si ya cuenta con conexion')

            const validConnectionAddress = ConnectionAddressSchema.safeParse(
                connection_address_tmp
            )
            if (!validConnectionAddress.success) {
                throw new Error(
                    validConnectionAddress.error.issues.map(
                        (error) => error.message
                    )
                )
            }
            console.log('connexion valida', connection_address_tmp)
            // genero el guardado en la db

            const database = await saveWaterDataForm(
                serviceRequest,
                form_data,
                validConnectionAddress.data
            )

            console.log(database)
            return res.status(200).json({
                message: 'Datos guardados correctamente',
                data: form_data,
                connection_address_tmp,
                serviceRequest,
            })
        }
        // Si el domicilio de conexion es el mismo solo valido que pasen si tiene o no agua
        if (!form_data.connectionState)
            throw new Error('Debe indicar si ya cuenta con conexion')

        console.log('usa el mismo domicilio')
        const database = await saveWaterDataForm(serviceRequest, form_data)
        console.log(database)

        // Genero el guardado sobre la db. TODO: Queda determinar si en el domicilio se guarda algo o solo un true
        return res.status(200).json({
            message: 'Datos guardados correctamente',
            data: form_data,
            serviceRequest,
        })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

const socialServiceData = async (req, res) => {
    try {
        const { id } = req.user
        const { serviceRequest, form_data, connection_address_tmp } = req.body
        if (!serviceRequest || !form_data)
            throw new Error('Faltan datos para realizar la consulta')
        if (!id) throw new Error('No tienes permisos para hacer esta accion')
        const idServiceForm = await getFormID(serviceRequest.id, 4)
        form_data.id_service_form = idServiceForm

        const database = await saveSocialDataForm(
            serviceRequest,
            form_data,
            connection_address_tmp
        )
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.message })
    }
}

const isFinalStep = async (requestID, currentStep) => {
    // Busco la solicitud de servicio
    const serviceRequest = await getRequestServiceData(requestID)
    // cuento los serviceItems
    const countServiceItems = serviceRequest.ServiceItems.length
    if (currentStep === countServiceItems) {
        console.log('Es el ultimo paso')
        return true
    }
    console.log('no es el ultimo paso')
    return false
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
        const { requestID, typeService } = req.body
        if (!requestID || !typeService)
            throw new Error('Faltan datos para realizar la consulta')
        const serviceForm = await getServiceFormByServiceRequest(
            requestID,
            typeService
        )

        res.status(200).json({
            message: 'Datos obtenidos correctamente',
            serviceItems: serviceForm,
        })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

module.exports = {
    newRequestService,
    getRequestsByUser,
    updateServiceRequest,
    getRequestsData,
    getFormService,
    savePersonalData,
    returnLater,
    firstStepData,
    electricFormData,
    waterFormData,
}
