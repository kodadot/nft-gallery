import axios from 'axios'

export async function handler(event) {


  const hash = event.queryStringParameters.hash

  if (!hash) {
    return {
      statusCode: 403,
      body: 'Cannot unpin without hash',
    }
  }

  const BASE_URL = `https://api.pinata.cloud/pinning/unpin/${hash}`

  try {
    const { status, data } = await axios.delete(BASE_URL, {
      headers: {
        'Content-Type': 'application/json',
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY
      },
    })
    console.log('[PINATA] Pin HASH', status, data)

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

