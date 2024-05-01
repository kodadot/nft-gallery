type PreloadableImage = {
  id: string
  image: string
}

export const usePreloadImages = (mintedNFTs: Ref<PreloadableImage[]>) => {
  const { completed, fulfilledAll, triedAll, tryItem } = useAsyncRetry()

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

  return { triedAll, loadedAll: fulfilledAll, completed }
}
