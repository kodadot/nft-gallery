import { chainPropListOf } from '@/utils/config/chain.config'
import { ChainProperties } from '@/utils/api/Query'
import { getChainTestList } from '@/utils/constants'

export default function () {
  const { $store, $config } = useNuxtApp()
  const { urlPrefix } = usePrefix()

  const chainProperties = computed<ChainProperties>(() => {
    return chainPropListOf(urlPrefix.value)
  })

  const decimals = computed<number>(() => {
    return chainProperties.value.tokenDecimals
  })

  const unit = computed<string>(() => {
    return chainProperties.value.tokenSymbol
  })

  const offersDisabled = computed(() => {
    return urlPrefix.value !== 'snek' && urlPrefix.value !== 'bsx'
  })

  const availableChains = computed(() => {
    const availableUrlPrefixes = $store.getters['availableUrlPrefixes']

    if (!$config.public.dev) {
      return availableUrlPrefixes.filter(
        (urlPrefix) => !getChainTestList().includes(urlPrefix.value)
      )
    }

    return availableUrlPrefixes
  })

  return {
    decimals,
    unit,
    offersDisabled,
    chainProperties,
    availableChains,
  }
}
