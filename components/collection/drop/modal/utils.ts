import type { DropMintedNft } from '@/composables/drop/useGenerativeDropMint'

export const usePreloadMintedNftCover = (
  mintedNft: ComputedRef<DropMintedNft | undefined>,
) => {
  const nftCoverLoaded = ref(false)
  const retry = ref(3)

  const sanitizedMintedNft = computed<DropMintedNft | undefined>(
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

type PreloadableImage = {
  id: string
  image: string
}

export const usePreloadImages = (mintedNFTs: Ref<PreloadableImage[]>) => {
  const { completedAll, tryItem, triedAll } = useAsyncRetry()

  watch(mintedNFTs, (items) => {
    if (items?.length) {
      items.forEach((item) =>
        tryItem({
          id: item.id,
          promise: () => preloadImage(sanitizeIpfsUrl(item.image)),
        }),
      )
    }
  })

  return { triedAll, loadedAll: completedAll }
}
