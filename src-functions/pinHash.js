import axios from "axios"

exports.handler = async (event, context) => {


  // const location = event.queryStringParameters.location || "home";
  const BASE_URL = 'https://api.pinata.cloud/pinning/pinByHash';
  const object = event.body;

  try {
    const { status, data } = await axios.post(BASE_URL, object, {
      headers: {
        'Content-Type': 'application/json',
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
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

