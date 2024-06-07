export default () => {
  const { mintedNFTs, toMintNFTs } = storeToRefs(useDropStore())

  const canMint = computed(() => Boolean(toMintNFTs.value.length))
  const canList = computed(() => Boolean(mintedNFTs.value.length))

  return {
    canMint,
    canList,
  }
}
