const expres = require('express');
const { verifyToken } = require('../middleware/Auth.middleware');
const {
    newRequestService,
    getRequestsByUser,
    updateServiceRequest,
    getRequestsData,
    getFormService,
    savePersonalData,
    returnLater,
    firstStepData,
} = require('../controllers/RequestService.controller');
const { createOrUpdatePeople } = require('../controllers/Person.controller');
const router = expres.Router();

router.get('/testRequest', (req, res) => {
    res.send('Test request');
});

// FUNCIONES PARA SOLICITUD DE SERVICIOS
router.post('/createRequestService', verifyToken, newRequestService);
router.post('/returnLater', verifyToken, returnLater);

router.post('/firstStep', verifyToken, firstStepData);
router.post('/getRequestsByUser', verifyToken, getRequestsByUser);
router.post('/createOrUpdatePeople', verifyToken, createOrUpdatePeople);
router.post('/updateServiceRequest', verifyToken, updateServiceRequest);
router.post('/getRequestsData', verifyToken, getRequestsData);
router.post('/getFormService', verifyToken, getFormService);

module.exports = router;
