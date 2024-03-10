import useGenerativeDropMint from '@/composables/drop/useGenerativeDropMint'

export const usePreloadMintedNftCover = () => {
  const nftCoverLoaded = ref(false)
  const retry = ref(3)
  const { claimedNft } = useGenerativeDropMint()

  const sanitizedMintedNft = computed(
    () =>
      claimedNft?.value && {
        ...claimedNft.value,
        image: sanitizeIpfsUrl(claimedNft.value.image),
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
