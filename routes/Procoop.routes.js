const expres = require('express')
const { verifyToken } = require('../middleware/Auth.middleware')
const {
    getRelationships,
    getAll,
} = require('../controllers/Procoop.controller')
const router = expres.Router()

router.get('/getRelationships', verifyToken, getRelationships)
router.get('/getAll', getAll)

module.exports = router
