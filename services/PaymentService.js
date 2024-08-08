const axios = require('axios')

const payFunCheckout = async () => {
	try {
		const data = JSON.stringify({
			currency_id: 'ARS',
			external_transaction_id: '4129934',
			due_date: '2024-08-10T12:45:00-0300',
			source: {
				type: 'web',
				id: '000001',
				name: 'caja 5',
			},
			return_url: 'https://payfun.com.ar',
			back_url: 'https://payfun.com.ar',
			notification_url: 'https://desarrollo.coopmorteros.coop/Testjuan/payfun',
			details: [
				{
					external_reference: '122',
					concept_description: 'Cuota 1/1999',
					amount: '62.33',
				},
			],
			payer: {
				name: 'JUAN GONZALEZ',
				email: 'juanfabri69@hotmail.com',
				identification: {
					type: 'DNI_ARG',
					number: '99999999',
					country: 'ARG',
				},
			},
		})

		var config = {
			method: 'post',
			maxBodyLength: Infinity,
			url: 'https://checkouts.payfun.com.ar/v2/checkout',
			headers: {
				'x-api-key': 'MGRjOTY3ZjI0OTg1YTQxYjliNzY3OTBkNDIzYjc1YTJhZDk0NWFiN2Y5ZmRiMjA5',
				'x-access-token': 'MTAyNjc5YWY3YzRmNjQwZjI0OWI4YzYyMmI5ZDMxMDM0YzU4NTU3ZjJhNmE4YTEw',
				'Cache-Control': 'no-cache',
				'Content-Type': 'application/json',
			},
			data: data,
		}
		const result = await axios(config)
			.then(function (response) {
				return { status: 1, data: response.data }
			})
			.catch(function (error) {
				return { status: 0, data: error.response.data.error }
			})
		return result
	} catch (error) {
		throw new Error(error)
	}
}

module.exports = {
	payFunCheckout,
}
