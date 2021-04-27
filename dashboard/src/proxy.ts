import Axios from 'axios';
import { extractCid, justHash } from './utils/ipfs';

export const BASE_URL = `${window.location.origin}/.netlify/functions/`;

const api = Axios.create({
  baseURL: BASE_URL
});

export const pinJson = async (object: any) => {
  try {
    const { status, data } = await api.post('pinJson', object);
    console.log('[PROXY] Pin JSON', status, data);
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

  const SLATE_URL = 'https://uploads.slate.host/api/public'

  try {
    const { status, data } = await Axios.post(SLATE_URL, formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
        Authorization: `Basic ${process.env.VUE_APP_SLATE_KEY}`
      }
    });
    console.log('[PROXY] SLATE Image', status, data);
    if (status < 400) {
      await api.post('pinHash', { hashToPin: data.data.cid })
      return data.data.cid;
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
    const { status, data } = await api.delete(`unpin/?hash=${hash}`);
    console.log('[PROXY] Unpin whatever', status, data);
    if (status < 400) {
      return data;
    }
  } catch (e) {
    throw e;
  }
};


export default api;
// QmYt2FydonvVMsEqe2q3hvm38WDq21xM8Z5ZSHZw19PwjF;
