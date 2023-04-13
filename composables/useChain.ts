import { chainPropListOf } from '@/utils/config/chain.config'
import { ChainProperties } from '@/utils/api/Query'
import { availablePrefixes } from '@/utils/chain'

export default function () {
  const { urlPrefix, tokenId, assets } = usePrefix()
  const { symbol } = assets(tokenId.value)

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

  const availableChains = computed(() => availablePrefixes())

  const chainSymbol = computed(() => {
    return ['rmrk', 'ksm'].includes(urlPrefix.value) ? unit.value : symbol
  })

  return {
    decimals,
    unit,
    offersDisabled,
    chainProperties,
    availableChains,
    chainSymbol,
  }
}
