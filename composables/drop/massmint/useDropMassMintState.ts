export default () => {
  const { allocatedNFTs, mintedNFTs } = storeToRefs(useDropStore())

  const canMint = computed(() => Boolean(allocatedNFTs.value.length))
  const canList = computed(() => Boolean(mintedNFTs.value.length))

  return { canMint, canList }
}
