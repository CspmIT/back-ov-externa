const express = require('express')
const router = express.Router()
const {
	getNameCustomer,
	searchByCuit,
	searchByDNI,
	addUserPersonMember,
	removeUserPersonMember,
	changePrimaryAccountUserProcoop,
	getAllStreet,
	getServicesTelecomunications,
	getSituationsIva,
	migrationCity,
	testConectOncativo,
} = require('../controllers/Procoop.controller')
const { createOrUpdatePeople } = require('../controllers/Person.controller')
const {
	dataUser,
	upgradeUser,
	updateUser,
	searchUserxDni,
	getAllAccount,
	searchUserxNumCustomer,
	dataUserProfile,
	updateProfile,
	updatePhotoProfile,
	usersRegistered,
	addCustomerUser,
	addOtherCustomer,
} = require('../controllers/User.controller')
const { verifyToken } = require('../middleware/Auth.middleware')
const { logout } = require('../controllers/Auth.controller')
const { getListState, getListCity, getListStreet, newStreet, getAddress, newStreetAPi, newStreetProcoop } = require('../controllers/Location.controller')
const { getServicesCustomer, getDetailConsumption, getAllConsumptionsGroupedByAccount, getDataServiceSocial  } = require('../controllers/Services.controller')
const { addCommentary, activePopups, Informations, ImageInformations, Popups } = require('../controllers/Managment.controller')
// const {
//     newRequestService,
//     getRequestsByUser,
//     updateServiceRequest,
//     getRequestsData,
//     getFormService,
// } = require('../controllers/RequestService.controller')
const { peopleByDocumentNumber } = require('../controllers/Person.controller')
const { paymentMethods, payLink, voucherCustomer } = require('../controllers/Payment.controller')
const { getCredentials } = require('../controllers/Minio.controller')

router.get('/test', (req, res) => {
	res.json({ message: 'Test route' })
})

router.get('/getMinio', verifyToken, getCredentials)
// router.get('/getUser', verifyToken)
// router.get('/newQuery', verifyToken, newQuery)
router.get('/logout', verifyToken, logout)
router.post('/searchDni', verifyToken, searchByDNI)
router.post('/searchCuit', verifyToken, searchByCuit)
// router.get('/users', migrationUser)
router.get('/dataUser', verifyToken, dataUser)
router.get('/dataUserProfile', verifyToken, dataUserProfile)
router.get('/activePopups', verifyToken, activePopups)
// router.get('/localidad', migrationCity)
// router.get('/provincia', migrationState)

router.post('/levelUp', verifyToken, addCustomerUser)
router.post('/addOtherCustomer', verifyToken, addOtherCustomer)

//funciones generales del usuario
router.post('/getCustomer', verifyToken, getNameCustomer)
router.patch('/upgradeLevelUser', verifyToken, upgradeUser)
router.patch('/updateProfile', verifyToken, updateProfile)
router.patch('/updatePhotoProfile', verifyToken, updatePhotoProfile)
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
router.get('/allStreet', verifyToken, getAllStreet)
router.post('/addStreetApi', verifyToken, newStreetAPi)
router.post('/addStreetProcoop', verifyToken, newStreetProcoop)
router.post('/getAddress', verifyToken, getAddress)

//Funciones de servicios
router.get('/getServiceCustomer', verifyToken, getServicesCustomer)
router.get('/getDetailConsumption', verifyToken, getDetailConsumption)
//Obtener todoos los consumos de un socio agrupados por cuenta
router.get('/getAllByAccount', verifyToken, getAllConsumptionsGroupedByAccount)

// Funcion para recuperar toda la informacion del usuario por dni
router.get('/searchUserxDni', verifyToken, searchUserxDni)
router.get('/searchUserxNumCustomer', verifyToken, searchUserxNumCustomer)

// Funciones para buscar en procoop
router.get('/searchServicesTelecomunications/:typeUser', verifyToken, getServicesTelecomunications)
router.get('/getSituationsIva', verifyToken, getSituationsIva)

//FUNCIONES PARA OBTENER INFORMACION UTIL
router.get('/informations', verifyToken, Informations)
router.get('/imageInformations', verifyToken, ImageInformations)

// FUNCIONES PARA OBTENER POP UPS
router.get('/getPopups', verifyToken, Popups)

// Funciones de Peoples
router.post('/searchPeopleByDocumentNumber', verifyToken, peopleByDocumentNumber)

router.post('/addCommentary', verifyToken, addCommentary)
router.get('/getUsersRegistered', verifyToken, usersRegistered)

//METODOS DE PAGO
router.get('/payMethods', verifyToken, paymentMethods)
router.post('/payLink', verifyToken, payLink)
router.get('/getBillsCustomer', verifyToken, voucherCustomer)

router.get('/getDataServiceSocial', verifyToken, getDataServiceSocial)

module.exports = router
