export default () => {
  const { allocatedNFTs, mintedNFTs, toMintNFTs } = storeToRefs(useDropStore())

  const canMint = computed(() => Boolean(allocatedNFTs.value.length))
  const canList = computed(() => Boolean(mintedNFTs.value.length))
  const canPin = computed<boolean>(
    () =>
      toMintNFTs.value
        .map((toMintNft) => toMintNft.imageDataPayload)
        .every(Boolean) && Boolean(toMintNFTs.value.length),
  )

  return {
    canMint,
    canList,
    canPin,
  }
}
