import { chainPropListOf } from '@/utils/config/chain.config'
import { ChainProperties } from '@/utils/api/Query'
export default function () {
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

  return {
    decimals,
    unit,
  }
}
