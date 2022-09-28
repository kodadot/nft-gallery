import { ApiFactory } from '@kodadot1/sub-api'
import type { ApiPromise } from '@polkadot/api'
import { getChainEndpointByPrefix } from '@/utils/chain'

export default function () {
  const { $store } = useNuxtApp()

  const apiUrl = computed(() => {
    const endpoint = getChainEndpointByPrefix($store.getters.currentUrlPrefix)
    return endpoint || $store.getters.getSettings['apiUrl']
  })
  const apiInstance = computed<Promise<ApiPromise>>(() =>
    ApiFactory.useApiInstance(apiUrl.value)
  )

  return {
    apiUrl,
    apiInstance,
  }
}
