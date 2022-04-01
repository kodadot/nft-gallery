export const visitedNFTs = () => {
  const getHistory = localStorage.getItem('history')
  if (!getHistory) {
    return []
  }

  const {
    history: { visitedNFTs },
  } = getHistory && JSON.parse(getHistory)

  return visitedNFTs
}
