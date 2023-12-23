import { chainPropListOf } from '@/utils/config/chain.config'
import { ChainProperties } from '@/utils/api/Query'
import {
  availablePrefixWithIcon,
  availablePrefixes,
  getChainName,
} from '@/utils/chain'
import type { Prefix } from '@kodadot1/static'

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

  const decimalsOf = (urlPrefix: Prefix) => {
    return chainPropListOf(urlPrefix).tokenDecimals
  }

  const withDecimals = (value: number) => {
    // if already with decimals
    if (value.toString().length === decimals.value) {
      return value
    }

    return value * Math.pow(10, decimals.value)
  }

  const withoutDecimals = (value: number, digits = 4) => {
    return Number((value / Math.pow(10, decimals.value)).toFixed(digits))
  }

  const unit = computed<string>(() => {
    return chainProperties.value.tokenSymbol
  })

  const offersDisabled = computed(() => {
    return urlPrefix.value !== 'bsx'
  })

  const availableChains = computed(availablePrefixes)
  const availableChainsWithIcon = computed(availablePrefixWithIcon)

  const chainSymbol = computed(() => {
    // add ahr
    return ['rmrk', 'ksm', 'ahk', 'ahp'].includes(urlPrefix.value)
      ? unit.value
      : symbol.value
  })

  const blockExplorer = computed<string>(() => {
    return chainProperties.value.blockExplorer ?? 'https://kusama.subscan.io/'
  })
  return {
    decimals,
    decimalsOf,
    withDecimals,
    withoutDecimals,
    unit,
    offersDisabled,
    chainProperties,
    availableChains,
    availableChainsWithIcon,
    chainSymbol,
    blockExplorer,
    name,
  }
}
