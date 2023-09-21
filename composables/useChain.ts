import { chainPropListOf } from '@/utils/config/chain.config'
import { ChainProperties } from '@/utils/api/Query'
import { availablePrefixes, getChainName } from '@/utils/chain'

export default function () {
  const { urlPrefix, tokenId, assets } = usePrefix()
  const symbol = computed(() => assets(tokenId.value).symbol)
  const name = computed(() => getChainName(urlPrefix.value))

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
    return ['rmrk', 'ksm', 'ahk', 'ahp'].includes(urlPrefix.value)
      ? unit.value
      : symbol.value
  })

  const blockExplorer = computed<string>(() => {
    return chainProperties.value.blockExplorer ?? 'https://kusama.subscan.io/'
  })
  return {
    decimals,
    unit,
    offersDisabled,
    chainProperties,
    availableChains,
    chainSymbol,
    blockExplorer,
    name,
  }
}
