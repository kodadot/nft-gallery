export type VisitedNFT = {
  collection: string
  date: string
  id: string
  image: string
}

/**
 * Get visited NFTs from localStorage
 */
export const visitedNFTs = (): VisitedNFT[] => {
  const getHistory = localStorage.getItem('history')
  if (!getHistory) {
    return []
  }

  const {
    history: { visitedNFTs },
  } = getHistory && JSON.parse(getHistory)

  return visitedNFTs
}
