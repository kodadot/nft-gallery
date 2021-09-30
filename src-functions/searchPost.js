import axios from 'axios'

exports.handler = async (event, context) => {


  const query = event.queryStringParameters.query

  if (!query) {
    return {
      statusCode: 403,
      body: 'Cannot search without query',
    }
  }

  const BASE_URL = `https://app.subsocial.network/offchain/v1/offchain/search?indexes=posts&q=${query}&offset=0&limit=20`

  try {
    const { status, data } = await axios.get(BASE_URL, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    console.log('[SUBSOCIAL] Search', status)

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

