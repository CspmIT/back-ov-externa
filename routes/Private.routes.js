const express = require('express')
const router = express.Router()
const { getNameCustomer, searchByCuit, searchByDNI, addUserPersonMember, removeUserPersonMember, changePrimaryAccountUserProcoop } = require('../controllers/Procoop.controller')
const { dataUser, upgradeUser, updateUser, searchUserxDni, getAllAccount, searchUserxNumCustomer } = require('../controllers/User.controller')
const { verifyToken } = require('../middleware/Auth.middleware')
const { logout } = require('../controllers/Auth.controller')
const { getListState, getListCity, getListStreet, newStreet, getAddress } = require('../controllers/Location.controller')
const { customerServicesDetail } = require('../controllers/Services.controller')
const { addCommentary } = require('../controllers/Managment.controller')
const { newRequestService, getRequestsByUser } = require('../controllers/RequestService.controller')
const { peopleByDocumentNumber } = require('../controllers/Person.controller')

router.get('/test', (req, res) => {
	res.json({ message: 'Test route' })
})

// router.get('/getUser', verifyToken)
// router.get('/newQuery', verifyToken, newQuery)
router.get('/logout', verifyToken, logout)
router.post('/searchDni', verifyToken, searchByDNI)
router.post('/searchCuit', verifyToken, searchByCuit)
// router.get('/users', migrationUser)
router.get('/dataUser', verifyToken, dataUser)
// router.get('/localidad', migrationCity)
// router.get('/provincia', migrationState)

//funciones generales del usuario
router.post('/getCustomer', verifyToken, getNameCustomer)
router.patch('/upgradeLevelUser', verifyToken, upgradeUser)
router.patch('/updateUser', verifyToken, updateUser)
router.patch('/updatePassword', verifyToken, updateUser)

// traigo el listado de todas las cuentas de procoop relacionadas
router.get('/allOther', verifyToken, getAllAccount)
router.post('/createOther', verifyToken, addUserPersonMember)
router.delete('/deleteOther', verifyToken, removeUserPersonMember)

router.patch('/chagePrimayMember', verifyToken, changePrimaryAccountUserProcoop)

// Funciones de localidad
router.get('/listState', verifyToken, getListState)
router.get('/listCity', verifyToken, getListCity)
router.get('/listStreet', verifyToken, getListStreet)
router.post('/addStreet', verifyToken, newStreet)
router.post('/getAddress', verifyToken, getAddress)

//Funciones de servicios
router.post('/getDetailService', customerServicesDetail)

// Funcion para recuperar toda la informacion del usuario por dni
router.get('/searchUserxDni', verifyToken, searchUserxDni)
router.get('/searchUserxNumCustomer', verifyToken, searchUserxNumCustomer)

// FUNCIONES PARA SOLICITUD DE SERVICIOS
router.post('/createRequestService', verifyToken, newRequestService)
router.post('/getRequestsByUser', verifyToken, getRequestsByUser)

// Funciones de Peoples
router.post('/searchPeopleByDocumentNumber', verifyToken, peopleByDocumentNumber)

router.post('/addCommentary', verifyToken, addCommentary)

module.exports = router
