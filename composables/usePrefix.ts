import { DEFAULT_PREFIX } from '@kodadot1/static'
import { getKusamaAssetId } from '@/utils/api/bsx/query'
import { useAssetsStore } from '@/stores/assets'
import { getAvailablePrefix } from '@/utils/chain'

import type { Prefix } from '@kodadot1/static'

const sharedPrefix = ref<Prefix>()

export default function () {
  const route = useRoute()
  const storage = useLocalStorage('urlPrefix', { selected: DEFAULT_PREFIX })
  const initialPrefixFromPath = getAvailablePrefix(route.path.split('/')[1])
  const validPrefixFromRoute = computed(() =>
    getAvailablePrefix(route.params.prefix)
  )

  const prefix = computed<Prefix>(
    () =>
      (sharedPrefix.value ||
        validPrefixFromRoute.value ||
        storage.value.selected ||
        initialPrefixFromPath) as Prefix
  )

  watch(
    prefix,
    (value) => {
      if (value) {
        sharedPrefix.value = value
        storage.value = { selected: value }
      }
    },
    { immediate: true }
  )

  const urlPrefix = computed<Prefix>(() => {
    return prefix.value
  })

  const setUrlPrefix = (prefix: Prefix) => {
    sharedPrefix.value = prefix
  }

  const client = computed<string>(() => {
    return urlPrefix.value
  })

  const tokenId = computed(() => getKusamaAssetId(urlPrefix.value))

  const assets = (id: string | number) => {
    if (prefix.value === 'snek' || prefix.value === 'bsx') {
      useAssetsStore().fetchAssetList()
    }
    return useAssetsStore().getAssetById(String(id))
  }

  const isTestnet = computed(() => prefix.value === 'snek')

  return {
    urlPrefix,
    setUrlPrefix,
    client,
    tokenId,
    assets,
    isTestnet,
  }
}
