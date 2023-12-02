import { DEFAULT_PREFIX } from '@kodadot1/static'
import { getKusamaAssetId } from '@/utils/api/bsx/query'
import { useIdentityStore } from '@/stores/identity'
import { useAssetsStore } from '@/stores/assets'
import { getAvailablePrefix } from '@/utils/chain'
import { ss58Of } from '@/utils/config/chain.config'

import type { Prefix } from '@kodadot1/static'

export default function () {
  const sharedPrefix = ref<Prefix>()
  const route = useRoute()
  const storage = useLocalStorage('urlPrefix', { selected: DEFAULT_PREFIX })
  const initialPrefixFromPath = getAvailablePrefix(route.path.split('/')[1])
  const identityStore = useIdentityStore()
  const urlPrefix = useState('urlPrefix')

  const validPrefixFromRoute = computed(() =>
    getAvailablePrefix(route.params.prefix),
  )

  const prefix = computed<Prefix>(
    () =>
      (sharedPrefix.value ||
        validPrefixFromRoute.value ||
        storage.value.selected ||
        initialPrefixFromPath) as Prefix,
  )

  const handlePrefixChange = (value: Prefix) => {
    sharedPrefix.value = value
    storage.value = { selected: value }
    identityStore.setCorrectAddressFormat(ss58Of(value))
  }

  watch(
    prefix,
    (value) => {
      if (value) {
        handlePrefixChange(value)
      }
    },
    { immediate: true },
  )

  watch(prefix, () => {
    urlPrefix.value = prefix.value
  })

  onMounted(() => {
    urlPrefix.value = prefix.value
  })

  const setUrlPrefix = (prefix: Prefix) => {
    handlePrefixChange(prefix)
  }

  const client = computed<string>(() => {
    return urlPrefix.value
  })

  const tokenId = computed(() => getKusamaAssetId(urlPrefix.value))

  const assets = (id: string | number) => {
    if (prefix.value === 'bsx') {
      useAssetsStore().fetchAssetList()
    }
    return useAssetsStore().getAssetById(String(id))
  }

  const isTestnet = false // computed(() => prefix.value === 'ahr')

  return {
    urlPrefix,
    setUrlPrefix,
    client,
    tokenId,
    assets,
    isTestnet,
  }
}
