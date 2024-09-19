import { DEFAULT_PREFIX } from '@kodadot1/static'
import type { Prefix } from '@kodadot1/static'
import { useWalletStore } from '@/stores/wallet'
import { useAssetsStore } from '@/stores/assets'
import { getAvailablePrefix } from '@/utils/chain'

const sharedPrefix = ref<Prefix>()

export default function () {
  const route = useRoute()
  const storage = useLocalStorage('urlPrefix', { selected: DEFAULT_PREFIX })
  const initialPrefixFromPath = getAvailablePrefix(route.path.split('/')[1])
  const walletStore = useWalletStore()

  const validPrefixFromRoute = computed(() =>
    getAvailablePrefix(route.params.prefix),
  )

  const prefix = computed<Prefix>(
    () =>
      (sharedPrefix.value
      || validPrefixFromRoute.value
      || storage.value.selected
      || initialPrefixFromPath) as Prefix,
  )

  const handlePrefixChange = (value: Prefix) => {
    sharedPrefix.value = value
    storage.value = { selected: value }
    walletStore.switchChain(value)
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

  const urlPrefix = computed<Prefix>(() => {
    return prefix.value
  })

  const setUrlPrefix = (prefix: Prefix) => {
    handlePrefixChange(prefix)
  }

  const client = computed<string>(() => {
    return urlPrefix.value
  })

  const assets = (id: string | number) =>
    useAssetsStore().getAssetById(String(id))

  const isTestnet = false // computed(() => prefix.value === 'ahr')

  return {
    urlPrefix,
    setUrlPrefix,
    client,
    assets,
    isTestnet,
  }
}
