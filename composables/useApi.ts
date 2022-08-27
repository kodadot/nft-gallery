import { ApiFactory } from '@kodadot1/sub-api'
import type { ApiPromise } from '@polkadot/api'

export default function () {
  const { $store } = useNuxtApp()

  const apiUrl = computed(() => $store.getters.getSettings['apiUrl'])
  const apiInstance = computed<Promise<ApiPromise>>(() =>
    ApiFactory.useApiInstance(apiUrl.value)
  )

  return {
    apiUrl,
    apiInstance,
  }
}
