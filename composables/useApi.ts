import { ApiFactory } from '@kodadot1/sub-api'
import type { ApiPromise } from '@polkadot/api'
import { getChainEndpointByPrefix } from '@/utils/chain'

export default function () {
  const { urlPrefix } = usePrefix()

  const apiUrl = computed(() => {
    const endpoint: string = getChainEndpointByPrefix(urlPrefix.value) || ''
    return endpoint
  })

  const apiInstance = computed<Promise<ApiPromise>>(() =>
    ApiFactory.useApiInstance(apiUrl.value)
  )

  const apiInstanceByPrefix = (prefix: string) => {
    const endpoint: string = getChainEndpointByPrefix(prefix) || ''
    return ApiFactory.useApiInstance(endpoint)
  }

  return {
    apiUrl,
    apiInstance,
    apiInstanceByPrefix,
  }
}
