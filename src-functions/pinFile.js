import axios from 'axios'
import { URLS } from '~/utils/constants'

export async function handler(event) {
  const BASE_URL = `${URLS.providers.pinata}pinning/pinFileToIPFS`
  const object = event.body

  try {
    const { status, data } = await axios.post(BASE_URL, object, {
      headers: {
        'Content-Type':
          event.headers['Content-Type'] || event.headers['content-type'],
        maxBodyLength: 'Infinity',
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
      },
    })
    console.log('[PINATA] Pin FILE', status, data)

    return {
      statusCode: status,
      body: JSON.stringify(data),
    }
  } catch (e) {
    console.log('Error', e.message, e.data)
    return {
      statusCode: 500,
      body: e.message,
    }
  }
}
