import { chainPropListOf } from '@/utils/config/chain.config'
import { ChainProperties } from '@/utils/api/Query'
import {
  availablePrefixWithIcon,
  availablePrefixes,
  getChainName,
} from '@/utils/chain'
import type { Prefix } from '@kodadot1/static'
export type WithoutDecimalsParams = {
  value: number
  digits?: number
  prefix?: Prefix
}

export default function () {
  const { urlPrefix } = usePrefix()
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

  const withDecimals = (value: number, prefix = urlPrefix.value) => {
    const decimals = chainPropListOf(prefix).tokenDecimals
    // if already with decimals
    if (value.toString().length === decimals) {
      return value
    }

    return Math.trunc(value * Math.pow(10, decimals))
  }

  const withoutDecimals = ({
    value,
    digits = 4,
    prefix = urlPrefix.value,
  }: WithoutDecimalsParams) => {
    return Number(
      (value / Math.pow(10, chainPropListOf(prefix).tokenDecimals)).toFixed(
        digits,
      ),
    )
  }

  const unit = computed<string>(() => {
    return chainProperties.value.tokenSymbol
  })

  // TODO: offers will be enabled in the future (with atomic swaps)
  const offersDisabled = computed(() => true)

  const availableChains = computed(availablePrefixes)
  const availableChainsWithIcon = computed(availablePrefixWithIcon)

  const chainSymbol = computed(() => unit.value)

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
