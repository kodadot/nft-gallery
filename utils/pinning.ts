import Axios from 'axios'

export const BASE_URL = 'https://pinning.kodadot.workers.dev/'

const api = Axios.create({
  baseURL: BASE_URL,
})

export type PinningKey = {
	expiry: string,
	token: string,
}

type EstuaryApiResponse = {
  cid: string,
  estuaryId: number
  providers: string[]
}

export const pinJson = async (object: Record<string, any>, name: string) => {
  try {
    const { status, data } = await api.post<EstuaryApiResponse>(`pinJson/${name}`, object)
    console.log('[PINNING] Pin JSON', status)
    if (status < 400) {
      return data.cid
    } else {
      throw new Error(`[PINNING] Unable to PIN JSON for reasons ${status} ${data}`)
    }
  } catch (e) {
    console.warn(e)
    throw e
  }
}


export const getKey = async (address: string): Promise<PinningKey> => {
  try {
    const { status, data } = await api.get<PinningKey>(`getKey/${address}`)
    console.log('[PINNING] Obtain', status)
    return data
  } catch (e) {
    console.warn(e)
    throw e
  }
}

// TODO: implement revokeKey


export const pinFileToIPFS = async (file: Blob, token: string): Promise<string> => {
  const formData = new FormData()
  formData.append('data', file)

  try {
    const { status, data } = await Axios.post<EstuaryApiResponse>('https://shuttle-4.estuary.tech/content/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data;',
        'Authorization': `Bearer ${token}`
      },
    })
    console.log('[ESTUARY] Pin Image', status)
    if (status < 400) {
      return data.cid
    } else {
      throw new Error(`[PINNING] Unable to PIN Image for reasons ${status} ${data}`)
    }
  } catch (e) {
    console.warn(e)
    throw e
  }
}


export default api
// QmYt2FydonvVMsEqe2q3hvm38WDq21xM8Z5ZSHZw19PwjF;
