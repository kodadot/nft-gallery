import axios from "axios"

exports.handler = async (event, context) => {


  // const location = event.queryStringParameters.location || "home";
  const BASE_URL = 'https://api.pinata.cloud/pinning/pinByHash';
  const object = event.body;

  try {
    const { status, data } = await axios.post(BASE_URL, object, {
      headers: {
        'Content-Type': 'application/json',
        pinata_api_key: 'ec9710440d1ffa9dfc1f' || process.env.PINATA_API_KEY,
        pinata_secret_api_key: 'dbab03eeeba75a37d0cc6a46e3edab561cbe15726fccc66b4d47b423504ea485' || process.env.PINATA_SECRET_API_KEY,
      },
    });
    console.log('[PINATA] Pin HASH', status, data);

    return {
      statusCode: status,
      body: JSON.stringify(data),
    };


  } catch (e) {
    console.log('Error', e.message)
    return {
      statusCode: 500,
      body: e.message,
    };
  }

};

