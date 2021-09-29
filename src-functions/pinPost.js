import axios from 'axios'

exports.handler = async (event, context) => {


  // const location = event.queryStringParameters.location || "home";
  const BASE_URL = 'https://app.subsocial.network/offchain/v1/ipfs/add'
  const object = event.body

  try {
    const { status, data } = await axios.post(BASE_URL, object, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    console.log('[SUBSOCIAL] Pin JSON', status, data)

    if (status < 400) {
      return {
        statusCode: status,
        body: data,
      }
    }


  } catch (e) {
    console.log('Error', e.message)
    return {
      statusCode: 500,
      body: e.message,
    }
  }

  return {
    statusCode: status,
    body: '',
  }


}

