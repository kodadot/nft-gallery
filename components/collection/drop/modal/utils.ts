import type { DropMintedNft } from '@/composables/drop/useGenerativeDropMint'
import { MintedNFT } from '../types'

const RETRY_COUNT = 3

export const usePreloadMintedNftCover = (
  mintedNft: ComputedRef<DropMintedNft | undefined>,
) => {
  const nftCoverLoaded = ref(false)
  const retry = ref(RETRY_COUNT)

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

export const usePreloadMintedNftCovers = (mintedNFTs: Ref<MintedNFT[]>) => {
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

  const tryPreload = async (mintedNFT: MintedNFT) => {
    const id = mintedNFT.id
    const currentState = states.value.get(id) || {
      tries: RETRY_COUNT,
      loaded: false,
    }

    if (currentState.tries === 0 || currentState.loaded) {
      return
    }

    try {
      const loaded = await preloadImage(sanitizeIpfsUrl(mintedNFT.image))

      if (loaded) {
        states.value.set(id, {
          tries: currentState.tries,
          loaded: true,
        })
      }
    } catch (error) {
      states.value.set(id, { tries: currentState.tries - 1, loaded: false })
      tryPreload(mintedNFT)
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
