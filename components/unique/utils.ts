export const tokenIdToRoute = (tokenId: string): { id: string, item: string } => {
  const [collection, item] = tokenId.split('-')
  return {
    id: collection,
    item
  }
}

export const createTokenId = (collection: string, id: string) => `${collection}-${id}`

export const getRandomValues = (length: number): number[] => {
  const values = new Uint32Array(length)
  window.crypto.getRandomValues(values)
  return Array.from(values)
}
