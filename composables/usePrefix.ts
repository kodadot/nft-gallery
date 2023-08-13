import { DEFAULT_PREFIX } from '@kodadot1/static'
import { getKusamaAssetId } from '@/utils/api/bsx/query'
import { useAssetsStore } from '@/stores/assets'
import { getAvailablePrefix } from '@/utils/chain'

import type { Prefix } from '@kodadot1/static'

const sharedPrefix = ref<Prefix>()

export default function () {
  const route = useRoute()
  const storage = useLocalStorage('urlPrefix', { selected: DEFAULT_PREFIX })

  const urlPrefix = computed<Prefix>(
    () =>
      (sharedPrefix.value ||
        getAvailablePrefix(route.params.prefix) ||
        storage.value.selected ||
        getAvailablePrefix(route.path.split('/')[1])) as Prefix
  )

  const setUrlPrefix = (prefix: Prefix) => {
    storage.value = { selected: prefix }
    sharedPrefix.value = prefix
  }

  const client = computed<string>(() => {
    return urlPrefix.value
  })

  const tokenId = computed(() => getKusamaAssetId(urlPrefix.value))

  const assets = (id: string | number) => {
    if (urlPrefix.value === 'snek' || urlPrefix.value === 'bsx') {
      useAssetsStore().fetchAssetList()
    }
    return useAssetsStore().getAssetById(String(id))
  }

  const isTestnet = computed(() => urlPrefix.value === 'snek')

  return {
    urlPrefix,
    setUrlPrefix,
    client,
    tokenId,
    assets,
    isTestnet,
  }
}
