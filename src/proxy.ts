import Axios from 'axios';
import { APIKeys, pinFile as pinFileToIPFS } from './pinata';
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

export const getKey = async (address: string) => {
  try {
    const { status, data } = await api.get('getKey', { params: { address }});
    console.log('[PROXY] Obtain', status);
    if (status < 400) {
      return data;
    }
  } catch (e) {
    throw e;
  }
};

export const revokeKey = async (key: string) => {
  try {
    const { status, data } = await api.get('revokeKey', { params: { key }});
    console.log('[PROXY] Revoke', status);
    if (status < 400) {
      return data as APIKeys;
    }
  } catch (e) {
    throw e;
  }

  throw new Error('Key not found');
};

export const pinFileDirect = async (file: Blob): Promise<string> => {
  try {
    const keys: APIKeys = await getKey(`${file.type}::${file.size}`);
    const cid = await pinFileToIPFS(file, keys)
    revokeKey(keys.pinata_api_key).then(console.log, console.warn);
    return cid;
  } catch (e) {
    throw e;
  }
};

export const pinFile = async (file: Blob): Promise<string> => {
  const formData = new FormData();
  formData.append('data', file);

  try {
    const { status, data } = await api.post('pinFile', formData, {
      headers: {
        'Content-Type': `multipart/form-data;`
      }
    });
    console.log('[PROXY] Pin Image', status, data);
    if (status < 400) {
      return data.IpfsHash;
    } else {
      throw new Error('Unable to PIN for reasons');
    }
  } catch (e) {
    throw e;
  }
};

export const pinFileViaSlate = async (file: Blob): Promise<string> => {
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


export const pinSubSocialPost = async (object: any) => {
  try {
    const { status, data } = await api.post('pinPost', object);
    console.log('[PROXY] Pin JSON', status, data);
    if (status < 400) {
      return data;
    }
  } catch (e) {
    throw e;
  }
};

export const searchPost = async (query: string) => {
  try {
    const { status, data } = await api.get(`searchPost/?query=${query}`);
    console.log('[PROXY] Search Post', status, data);
    if (status < 400) {
      return data;
    }
  } catch (e) {
    throw e;
  }
};

export const requestFaucet = async (address: string, email: string) => {
  try {
    const { status, data } = await api.get(`searchPost/?address=${address}&email=${email}`);
    console.log('[PROXY] Search Post', status, data);
    if (status < 400) {
      return data;
    }
  } catch (e) {
    throw e;
  }
};

export default api;
// QmYt2FydonvVMsEqe2q3hvm38WDq21xM8Z5ZSHZw19PwjF;
