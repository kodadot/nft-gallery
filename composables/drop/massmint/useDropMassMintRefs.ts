export default () => {
  const dropStore = useDropStore()

  const mintingSession = computed({
    get: () => dropStore.mintingSession,
    set: (value) => dropStore.setMintingSession(value),
  })

  const toMintNFTs = computed({
    get: () => dropStore.toMintNFTs,
    set: (value) => dropStore.setToMintNFTs(value),
  })

  const allocatedNFTs = computed({
    get: () => dropStore.allocatedNFTs,
    set: (value) => dropStore.setAllocatedNFTs(value),
  })

  const amountToMint = computed({
    get: () => dropStore.amountToMint,
    set: (value) => dropStore.setAmountToMint(value),
  })

  return {
    mintingSession,
    toMintNFTs,
    allocatedNFTs,
    amountToMint,
  }
}
