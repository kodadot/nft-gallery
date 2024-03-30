export default () => {
  const { allocatedNFTs, mintedNFTs, toMintNFTs } = storeToRefs(useDropStore())

  const isRendering = computed(
    () =>
      toMintNFTs.value.filter((nft) => nft.imageDataPayload).length !==
        toMintNFTs.value.length && Boolean(toMintNFTs.value.length),
  )
  const renderingNFTsCount = computed(
    () =>
      toMintNFTs.value.filter((nft) => !nft.imageDataPayload && nft.canRender)
        .length,
  )
  const toRenderNFTsCount = computed(
    () => toMintNFTs.value.filter((nft) => !nft.canRender).length,
  )

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
    isRendering,
    renderingNFTsCount,
    toRenderNFTsCount,
  }
}
