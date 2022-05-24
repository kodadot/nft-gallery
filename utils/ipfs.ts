export const fastExtract = (ipfsLink?: string): string => {
  if (!ipfsLink) {
    return ''
  }

  return ipfsLink.replace('ipfs://ipfs/', '')
}

const cidRegex = /ipfs\/([a-zA-Z0-9]+)/
export const extractCid = (ipfsLink?: string): string => {
  if (!ipfsLink) {
    return ''
  }

  const match = cidRegex.exec(ipfsLink)
  if (!match) {
    const fastCid = fastExtract(ipfsLink)
    return fastCid
  }

  return match[1]
}
