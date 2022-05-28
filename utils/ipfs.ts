export const fastExtract = (ipfsLink?: string): string => {
  if (!ipfsLink) {
    return ''
  }

  return ipfsLink.replace(ipfsPrefix, '')
}

const ipfsPrefix = 'ipfs://ipfs/'

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

const isV0Cid = (cid: string): boolean => {
  return cid.length === 46 && cid.startsWith('Qm')
}

const isV1Cid = (cid: string): boolean => {
  return cid.length === 59 && cid.startsWith('baf')
}

export const isCID = (ipfsLink: string): boolean => {
  return isV0Cid(ipfsLink) || isV1Cid(ipfsLink)
}

export const toUrl = (linkOrCid: string): string => {
  if (linkOrCid.startsWith(ipfsPrefix)) {
    return linkOrCid
  }

  if (isCID(linkOrCid)) {
    return `${ipfsPrefix}${linkOrCid}`
  }

  console.warn('[IPFS::toUrl] Unknown link type', linkOrCid)
  return linkOrCid
}
