import { chainPropListOf } from '@/utils/config/chain.config'
import { ChainProperties } from '@/utils/api/Query'
import { getChainTestList } from '@/utils/constants'
import { availablePrefixes } from '@/utils/chain'

export default function () {
  const { $config } = useNuxtApp()
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

  const availableChains = computed(() => {
    const chainList = availablePrefixes()

    if (!$config.public.dev) {
      return chainList.filter(
        (urlPrefix) => !getChainTestList().includes(String(urlPrefix.value))
      )
    }

    return chainList
  })

  const chainSymbol = computed(() => {
    return ['rmrk', 'rmrk2'].includes(urlPrefix.value) ? unit.value : symbol
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
