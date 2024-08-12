const axios = require('axios')
const { Register, PasswordRecovery } = require('../utils/email/registerEmail')
const { db } = require('../models')
async function sendEmail(data, url) {
	const html = Register({ name: `${data.name_register} ${data.last_name_register}`, link: url })
	await axios
		.post(
			'https://api-dmds-morteros.planisys.net/v1/envio/send_one_inline/',
			{
				campana_id: 14,
				email: true,
				contacto: { email: data.email, nombre: data.name_register, apellido: data.last_name_register },
				html: html,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'e8ba65dc4d01ba6c',
				},
			}
		)
		.then(function (response) {
			console.log(response)
			return response
		})
		.catch(function (error) {
			console.log(error.response)
		})
}
async function sendRecoverPass(name, email, url) {
	try {
		const html = PasswordRecovery({ name: name, link: url })
		console.log(url)
		return true
		// axios
		//     .post(
		//         'https://api-dmds-morteros.planisys.net/v1/envio/send_one_inline/',
		//         {
		//             campana_id: 14,
		//             email: true,
		//             contacto: { email: email, nombre: '', apellido: '' },
		//             html: html
		//         },
		//         {
		//             headers: {
		//                 'Content-Type': 'application/json',
		//                 Authorization: 'e8ba65dc4d01ba6c'
		//             }
		//         }
		//     )
		//     .then(function (response) {
		//         console.log(response)
		//         return response;
		//     })
		//     .catch(function (error) {
		//         console.log(error.response)
		//     })
	} catch (error) {
		throw new Error('Hubo un error ene el envio del email')
	}
}

module.exports = { sendEmail, sendRecoverPass }
