import axios from "axios"

exports.handler = async (event, context) => {


  const hash = event.queryStringParameters.hash;

  if (!hash) {
    return {
      statusCode: 403,
      body: `Cannot unpin without hash`,
    };
  }

  const BASE_URL = `https://api.pinata.cloud/pinning/unpin/${hash}`;

  try {
    const { status, data } = await axios.delete(BASE_URL, {
      headers: {
        'Content-Type': 'application/json',
        pinata_api_key: process.env.PINATA_API_KEY || '441e075e2fb4d17a6067',
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY || 'b064b9081ecd557ffd52d01969345c7125341ac903b7db1b1e41e9538c0539c3'
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

