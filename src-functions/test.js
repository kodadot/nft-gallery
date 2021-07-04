import axios from "axios"

exports.handler = async (event, context) => {

  const BASE_URL = `https://api.pinata.cloud/data/testAuthentication`;
  const { PINATA_API_KEY, PINATA_SECRET_API_KEY } = process.env;

  console.log(PINATA_API_KEY, PINATA_SECRET_API_KEY)

  try {
    const { status, data } = await axios.get(BASE_URL, {
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });
    console.log('[PINATA] TEST', status, data);

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

