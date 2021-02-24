import Axios from 'axios';

export const BASE_URL = 'https://api.pinata.cloud/pinning/';

const api = Axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    pinata_api_key: process.env.VUE_APP_PINATA_API_KEY,
    pinata_secret_api_key: process.env.VUE_APP_PINATA_SECRET_API_KEY
  },
  withCredentials: false
});

export const pinJson = async (object: any) => {
  try {
    const { status, data } = await api.post('pinJSONToIPFS', object);
    console.log('[PINATA] Pin Image', status, data);
    if (status < 400) {
      return data.IpfsHash;
    }
  } catch (e) {
    throw e;
  }
};

export const pinFile = async (file: Blob): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const { status, data } = await api.post('pinFileToIPFS', formData, {
      headers: {
        'Content-Type': `multipart/form-data;`
      }
    });
    console.log('[PINATA] Pin Image', status, data);
    if (status < 400) {
      return data.IpfsHash;
    } else {
      throw new Error('Unable to PIN for reasons');
    }
  } catch (e) {
    throw e;
  }
};

export const unSanitizeIpfsUrl = (url: string) => {
  return `ipfs://ipfs/${url}`;
};


const cidRegex: RegExp = /ipfs\/([a-zA-Z0-9]+)\/?$/;
export const extractCid = (ipfsLink?: string): string => {
  if (!ipfsLink) {
    return ''
  }

  const match = ipfsLink.match(cidRegex);

  return match ? match[1] : '';  
}

export default api;
