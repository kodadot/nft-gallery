const BASE_URL = isProduction
  ? 'https://dyndata.koda.art'
  : 'https://dyndata-beta.koda.art'

const api = $fetch.create({
  baseURL: BASE_URL,
})

export const generateId = async () => {
  return (await api('/generate-id')) as string
}

export const setDyndataUrl = ({ chain, collection, nft }) => {
  const metadata = `https://dyndata.koda.art/v1/metadata/${chain}/${collection}/${nft}`
  const image = `https://dyndata.koda.art/v1/image/${chain}/${collection}/${nft}`

  return {
    metadata,
    image,
  }
}
