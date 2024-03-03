import useGenerativeDropMint from '@/composables/drop/useGenerativeDropMint'

export const usePreloadMintedNftCover = () => {
  const nftCoverLoaded = ref(false)
  const retry = ref(3)
  const { mintedNft } = useGenerativeDropMint()

  const sanitizedMintedNft = computed(
    () =>
      mintedNft?.value && {
        ...mintedNft.value,
        image: sanitizeIpfsUrl(mintedNft.value.image),
      },
  )

  watch([sanitizedMintedNft, retry], async ([mintedNft]) => {
    if (mintedNft?.image && retry.value) {
      try {
        nftCoverLoaded.value = await preloadImage(mintedNft.image)
      } catch (error) {
        retry.value -= 1
      }
    }
  })

  return {
    sanitizedMintedNft,
    nftCoverLoaded,
    retry,
  }
}
