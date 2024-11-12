const expres = require('express')
const { verifyToken } = require('../middleware/Auth.middleware')
const { getRelationships } = require('../controllers/Procoop.controller')
const router = expres.Router()

router.get('/getRelationships', verifyToken, getRelationships)

module.exports = router
