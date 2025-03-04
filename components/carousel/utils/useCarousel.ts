import type { CarouselNFT } from '@/components/base/types'
import { formatNFT, setCarouselMetadata } from '@/utils/carousel'
import { sortItemListByIds } from '@/utils/sorting'
import collectionEntityById from '@/queries/subsquid/general/collectionEntityById'
import nftEntitiesByIDs from '~/queries/subsquid/general/nftEntitiesByIDs'

export const useCarouselUrl = () => {
  const { urlPrefix } = usePrefix()

  const urlOf = ({ id = '', url = '', chain = '' }): string => {
    return `/${chain || urlPrefix.value}/${url}/${id}`
  }

  return {
    urlOf,
  }
}

export const useCarouselRelated = async ({ collectionId }) => {
  const route = useRoute()
  const nfts = ref<CarouselNFT[]>([])
  const { urlPrefix } = usePrefix()

  const { $apolloClient } = useNuxtApp()
  const { data } = await $apolloClient.query({
    query: collectionEntityById,
    variables: {
      id: collectionId,
      nftId: route.params.id.toString(),
      limit: 60,
    },
    context: {
      endpoint: urlPrefix.value,
    },
  })

  if (data.collection) {
    const listOfRelatedNFTs = formatNFT(
      data.collection.nfts,
    )
    nfts.value = await setCarouselMetadata(listOfRelatedNFTs)
  }

  return {
    nfts,
  }
}

export const useCarouselVisited = ({ ids }) => {
  const nfts = ref<CarouselNFT[]>([])

  if (!ids.length) {
    return {
      nfts,
    }
  }

  const { urlPrefix } = usePrefix()

  const { $apolloClient } = useNuxtApp()
  const data = ref()
  $apolloClient.query({
    query: nftEntitiesByIDs,
    variables: { ids },
    context: {
      endpoint: urlPrefix.value,
    },
  }).then((res) => {
    data.value = res.data
  })

  watch(data, async () => {
    if (data.value) {
      const filteredNftsNullMeta = data.value.nftEntities.filter(
        nft => nft.meta !== null,
      )

      if (filteredNftsNullMeta.length) {
        const sortedNftList = sortItemListByIds(filteredNftsNullMeta, ids, 30)
        nfts.value = formatNFT(sortedNftList)
      }
    }
  })

  return {
    nfts,
  }
}

// scroll wheel carousel events
// https://codesandbox.io/s/github/rcbyr/keen-slider-sandboxes/tree/v6/navigation-controls/scroll-wheel-controls/vue3?file=/src/App.vue
let touchTimeout
let position
let wheelActive

function dispatch(event, name, slider) {
  position.x -= event.deltaX
  position.y -= event.deltaY
  slider.container.dispatchEvent(
    new CustomEvent(name, {
      detail: {
        x: position.x,
        y: position.y,
      },
    }),
  )
}

export const CarouselWheelsPlugin = (slider) => {
  function eventWheel(event) {
    if (event.deltaX !== 0) {
      if (!wheelActive) {
        position = {
          x: event.pageX,
          y: event.pageY,
        }
        dispatch(event, 'ksDragStart', slider) // wheel start
        wheelActive = true
      }
      dispatch(event, 'ksDrag', slider) // wheel
      clearTimeout(touchTimeout)
      touchTimeout = setTimeout(() => {
        wheelActive = false
        dispatch(event, 'ksDragEnd', slider) // wheel end
      }, 50)
    }
  }

  slider.on('created', () => {
    slider.container.addEventListener('wheel', eventWheel, {
      passive: true,
    })
  })
}
