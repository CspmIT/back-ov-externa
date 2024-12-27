const { db } = require('../models')

async function getCredentials(req, res) {
    try {
        const credentials = await db.minio.findOne({
            where: { id: 1 },
        })
        return res.status(200).json(credentials)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = { getCredentials }
