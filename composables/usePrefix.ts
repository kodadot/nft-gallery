import { getKusamaAssetId } from '@/utils/api/bsx/query'

export default function () {
  const { $store } = useNuxtApp()

  const urlPrefix = computed<string>(() => {
    return $store.getters.currentUrlPrefix
  })

  const client = computed<string>(() => {
    return urlPrefix.value === 'rmrk' ? 'subsquid' : urlPrefix.value
  })

  const tokenId = computed(() => getKusamaAssetId(urlPrefix.value))

  return {
    urlPrefix,
    client,
    tokenId,
  }
}
