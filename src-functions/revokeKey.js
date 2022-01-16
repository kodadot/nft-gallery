import axios from 'axios';

export async function handler(event) {
  const BASE_URL = 'https://api.pinata.cloud/users/revokeApiKey';
  const key = event.queryStringParameters.key;

  if (!key) {
    return {
      statusCode: 403,
      body: 'Cannot revoke without key',
    };
  }

  const object = {
    apiKey: key,
  };

  try {
    const { status, data } = await axios.put(BASE_URL, object, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PINATA_MASTER}`,
      },
    });
    console.log('[PINATA] Revoke Key', status, data);

    if (status < 400) {
      return {
        statusCode: status,
        body: JSON.stringify(data),
      };
    }
  } catch (e) {
    console.log('Error', e.message);
    return {
      statusCode: 500,
      body: e.message,
    };
  }

  return {
    statusCode: status,
    body: JSON.stringify({}),
  };
}
