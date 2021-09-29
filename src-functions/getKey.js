import axios from 'axios'

exports.handler = async (event) => {
  const BASE_URL = 'https://api.pinata.cloud/users/generateApiKey'
  const keyName = event.queryStringParameters.address

  if (!keyName) {
    return {
      statusCode: 403,
      body: 'Cannot get key without address',
    }
  }

  const object = {
    keyName,
    maxUses: 2, // TODO: make this configurable
    permissions: {
      endpoints: {
        pinning: {
          pinFileToIPFS: true,
        }
      }
    }
  }

  try {
    const { status, data } = await axios.post(BASE_URL, object, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PINATA_MASTER}`
      },
    })
    console.log('[PINATA] Generate Key', status)

    if (status < 400) {
      return {
        statusCode: status,
        body: JSON.stringify(data),
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
    body: JSON.stringify({}),
  }
}

