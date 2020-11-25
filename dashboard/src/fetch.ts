// import IPFS from 'ipfs'
// // @ts-ignore: hacky lib
// import makeIpfsFetch from 'js-ipfs-fetch'


// const createIpfsFetch = async () => {
//   const ipfs = await IPFS.create()
//   const fetch = await makeIpfsFetch({ipfs})

//   return fetch
// }
 
// export default createIpfsFetch


import Axios from 'axios'

export const BASE_URL = 'https://ipfs.io/'

const api = Axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: false,
  })

export default api
