import axios from 'axios'

export async function handler() {
  const BASE_URL = 'https://api.cloudflare.com/client/v4/accounts/6d5454e55656237efc20c940d052685c/images/v1/direct_upload'

  try {
    const { status, data } = await axios.post(BASE_URL, undefined, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGE_KEY}`
      },
    })
    console.log('[CLOUDFLARE IMAGE] Generate Key', status)

    if (status < 400) {
      return {
        statusCode: status,
        body: JSON.stringify(data.result),
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

// 6d5454e55656237efc20c940d052685c
