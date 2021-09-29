import axios from 'axios'

exports.handler = async (event, context) => {


	const address = event.queryStringParameters.address
	const email = event.queryStringParameters.email

	if (!email || !address) {
		return {
			statusCode: 403,
			body: 'Cannot search without query',
		}
	}

	const BASE_URL = 'https://app.subsocial.network/offchain/v1/offchain/faucet/confirm'

	const object = {
		account: address,
		email
	}

	try {
		const { status, data } = await axios.post(BASE_URL, object, {
			headers: {
				'Content-Type': 'application/json',
			},
		})
		console.log('[SUBSOCIAL] Faucet', status)

		return {
			statusCode: status,
			body: JSON.stringify(data),
		}


	} catch (e) {
		console.log('Error', e.message)
		return {
			statusCode: 500,
			body: e.message,
		}
	}

}

