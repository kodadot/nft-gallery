import { getKusamaAssetId } from '@/utils/api/bsx/query'

export default function () {
  const { $store } = useNuxtApp()
  const route = useRoute()

  const prefix = ref(route.params.prefix || $store.getters.currentUrlPrefix)
  const urlPrefix = computed<string>(() => prefix.value || 'bsx')

  const client = computed<string>(() => {
    return urlPrefix.value === 'rmrk' ? 'subsquid' : urlPrefix.value
  })

  const tokenId = computed(() => getKusamaAssetId(urlPrefix.value))

  const assets = (id: string | number) => {
    return $store.getters['assets/getAssetById'](id)
  }

  // TODO: we can remove this watcher and `checkPrefixBeforeMount` function
  // once we are not rely on `$store.getters.currentUrlPrefix`
  const checkPrefixBeforeMount = () => {
    const prefix = route.params.prefix

    if ($store.getters.currentUrlPrefix !== prefix && prefix) {
      $store.dispatch('setUrlPrefix', prefix)
    }
  }
  watch([() => route.params.prefix], ([newPrefix]) => {
    if ($store.getters.currentUrlPrefix !== route.params.prefix && newPrefix) {
      prefix.value = newPrefix
      $store.dispatch('setUrlPrefix', newPrefix)
    }
  })

  return {
    urlPrefix,
    client,
    tokenId,
    assets,
    checkPrefixBeforeMount,
  }
}
