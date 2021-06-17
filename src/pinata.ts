import Axios from 'axios';
import { extractCid, justHash } from './utils/ipfs';

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

export const unpin = async (ipfsLink: string) => {
  const hash = justHash(ipfsLink) ? ipfsLink : extractCid(ipfsLink)
  try {
    const { status, data } = await api.delete(`unpin/${hash}`);
    console.log('[PINATA] Pin Image', status, data);
    if (status < 400) {
      return data;
    }
  } catch (e) {
    throw e;
  }
};



export default api;
// QmYt2FydonvVMsEqe2q3hvm38WDq21xM8Z5ZSHZw19PwjF;
