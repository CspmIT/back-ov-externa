const { testConectionOncativo } = require('../services/AuthService')

const testConectionOnc = async (req, res) => {
	try {
		await testConectionOncativo()
		res.json({ message: 'Conexión exitosa' })
	} catch (error) {
		res.status(400).json({ error: error.message })
	}
}
module.exports = {
	testConectionOnc,
}
