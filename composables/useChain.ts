import { chainPropListOf } from '@/utils/config/chain.config'
import { ChainProperties } from '@/utils/api/Query'

export default function () {
  const { urlPrefix } = usePrefix()
  const route = useRoute()

  const chainProperties = computed<ChainProperties>(() => {
    return chainPropListOf(route.params.prefix || urlPrefix.value)
  })

  const decimals = computed<number>(() => {
    return chainProperties.value.tokenDecimals
  })

  const unit = computed<string>(() => {
    return chainProperties.value.tokenSymbol
  })

  const offersDisabled = computed(() => {
    return route.params.prefix !== 'snek' && route.params.prefix !== 'bsx'
  })

  return {
    decimals,
    unit,
    offersDisabled,
  }
}
