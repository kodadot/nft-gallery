export const sanitizeIpfsUrl = (ipfsUrl) => {
  const rr = /^ipfs:\/\/ipfs/
  if (rr.test(ipfsUrl)) {
    return ipfsUrl.replace('ipfs://', 'https://kodadot.mypinata.cloud/')
  }
  return null
}

export const fetchNFTMetadata = async (url) => {
  const response = await fetch(url)
  return await response.json()
}

export let getNFTListBYIssuer = async (issuerId) => {
  let body = {
    operationName: 'nftListByIssuer',
    variables: {
      orderBy: 'BLOCK_NUMBER_DESC',
      account: issuerId,
      search: [],
      first: 62,
      offset: 0,
    },
    query:
      'query nftListByIssuer($account: String!, $first: Int!, $offset: Int, $search: [NFTEntityFilter!], $orderBy: NftEntitiesOrderBy = BLOCK_NUMBER_DESC) {\n  nFTEntities(\n    filter: {issuer: {equalTo: $account}, name: {notLike: "%Kanaria%"}, burned: {distinctFrom: true}, and: $search}\n    orderBy: [$orderBy, BLOCK_NUMBER_DESC]\n    first: $first\n    offset: $offset\n  ) {\n    totalCount\n    nodes {\n      ...nft\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment nft on NFTEntity {\n  id\n  name\n  metadata\n  issuer\n  currentOwner\n  blockNumber\n  sn\n  collectionId\n  price\n  burned\n  __typename\n}\n',
  }
  const response = await fetch(
    'https://api.subquery.network/sq/vikiival/magick/',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  )
  return await response.json()
}

export let getMetaData = async (metaInfo) => {
  let ipfURL = sanitizeIpfsUrl(metaInfo)
  let data = await fetchNFTMetadata(ipfURL)
  return {
    imageUrl: sanitizeIpfsUrl(data.image),
    artist: data.name,
    art: data.description,
  }
}

export const getParameterByName = (name) =>{
  let match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search)
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
}
