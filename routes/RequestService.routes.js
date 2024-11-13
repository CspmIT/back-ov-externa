const expres = require('express')
const { verifyToken } = require('../middleware/Auth.middleware')
const {
    newRequestService,
    getRequestsByUser,
    updateServiceRequest,
    getRequestsData,
    getFormService,
    returnLater,
    firstStepData,
    electricFormData,
    waterFormData,
} = require('../controllers/RequestService.controller')
const { createOrUpdatePeople } = require('../controllers/Person.controller')
const router = expres.Router()

router.get('/testRequest', (req, res) => {
    res.send('Test request')
})

// FUNCIONES PARA SOLICITUD DE SERVICIOS
router.post('/createRequestService', verifyToken, newRequestService)
router.post('/returnLater', verifyToken, returnLater)
// Guardado en el formulario de datos personales
router.post('/firstStep', verifyToken, firstStepData)
// Guardado del formulario de energia electrica
router.post('/saveElectricPower', verifyToken, electricFormData)
// router.post('/saveFormData', verifyToken);
router.post('/guardarAgua', verifyToken, waterFormData)
// Guardado del formulario de servicios sociales
router.post('/saveSocialServices', verifyToken, )

router.post('/getRequestsByUser', verifyToken, getRequestsByUser)
router.post('/createOrUpdatePeople', verifyToken, createOrUpdatePeople)
router.post('/updateServiceRequest', verifyToken, updateServiceRequest)
router.post('/getRequestsData', verifyToken, getRequestsData)
router.post('/getFormService', verifyToken, getFormService)

module.exports = router
