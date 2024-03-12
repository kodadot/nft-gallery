export default () => {
  const { allocatedNFTs } = storeToRefs(useDropStore())

  const canMint = computed(() => Boolean(allocatedNFTs.value.length))

  return { canMint }
}
