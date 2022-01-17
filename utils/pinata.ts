import Axios from 'axios'

export const BASE_URL = 'https://api.pinata.cloud/pinning/'

export type APIKeys = {
  pinata_api_key: string
  pinata_api_secret: string
}

const api = Axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})


export const pinFileToIPFS = async (file: Blob, keys: APIKeys): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const { status, data } = await api.post('pinFileToIPFS', formData, {
      headers: {
        'Content-Type': 'multipart/form-data;',
        pinata_api_key: keys.pinata_api_key,
        pinata_secret_api_key: keys.pinata_api_secret,
      },
    })
    console.log('[PINATA] Pin Image', status, data)
    if (status < 400) {
      return data.IpfsHash
    } else {
      throw new Error('Unable to PIN for reasons')
    }
  } catch (e) {
    console.warn(e)
    throw e
  }
}

export default api
// QmYt2FydonvVMsEqe2q3hvm38WDq21xM8Z5ZSHZw19PwjF;
