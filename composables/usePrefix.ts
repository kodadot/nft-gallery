import { getKusamaAssetId } from '@/utils/api/bsx/query'

export default function () {
  const { $store } = useNuxtApp()
  const route = useRoute()
  const router = useRouter()

  const urlPrefix = computed<string>(() => {
    return $store.getters.currentUrlPrefix
  })

  const client = computed<string>(() => {
    return urlPrefix.value === 'rmrk' ? 'subsquid' : urlPrefix.value
  })

  const tokenId = computed(() => getKusamaAssetId(urlPrefix.value))

  const assets = (id: string | number) => {
    return $store.getters['assets/getAssetById'](id)
  }

  const checkPrefixBeforeMount = () => {
    const prefix = route.params.prefix

    if (urlPrefix.value !== prefix) {
      $store.dispatch('setUrlPrefix', prefix)
      router.go(0)
    }
  }

  return {
    urlPrefix,
    client,
    tokenId,
    assets,
    checkPrefixBeforeMount,
  }
}
