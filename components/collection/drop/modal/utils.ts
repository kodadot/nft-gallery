const RETRY_COUNT = 3

type PreloadableImage = {
  id: string
  image: string
}

export const usePreloadImages = (mintedNFTs: Ref<PreloadableImage[]>) => {
  const states = ref(new Map<string, { tries: number; loaded: boolean }>())

  const stateValues = computed(() =>
    Object.values(Object.fromEntries(states.value.entries())),
  )
  const triedAll = computed(
    () =>
      stateValues.value.length &&
      Number(getSumOfObjectField(stateValues.value, 'tries')) === 0,
  )
  const loadedAll = computed(() => {
    const loaded = stateValues.value.map((item) => item.loaded)
    return loaded.length && loaded.every(Boolean)
  })

  const tryPreload = async (preloadableImage: PreloadableImage) => {
    const id = preloadableImage.id
    const currentState = states.value.get(id) || {
      tries: RETRY_COUNT,
      loaded: false,
    }

    if (currentState.tries === 0 || currentState.loaded) {
      return
    }

    try {
      await preloadImage(sanitizeIpfsUrl(preloadableImage.image))

      states.value.set(id, {
        tries: currentState.tries,
        loaded: true,
      })
    } catch (error) {
      states.value.set(id, { tries: currentState.tries - 1, loaded: false })
      tryPreload(preloadableImage)
    }
  }

  watch(mintedNFTs, (items) => {
    if (items && items.length) {
      states.value = new Map()
      items.forEach(tryPreload)
    }
  })

  return { triedAll, loadedAll }
}
