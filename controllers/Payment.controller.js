const { payFunCheckout } = require('../services/PaymentService')

const paymentPayFun = async (req, res) => {
	try {
		const result = await payFunCheckout()
		const status = result.status === 1 ? 200 : 400
		return res.status(status).json(result.data)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

module.exports = {
	paymentPayFun,
}
