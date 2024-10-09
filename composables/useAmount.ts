import type { Prefix } from '@kodadot1/static'
import { formatAmountWithRound } from '@/utils/format/balance'

export default function (
  tokenAmount: ComputedRef<number | string | undefined>,
  tokenDecimals: ComputedRef<number>,
  chainSymbol: ComputedRef<string>,
  { roundBy, withBlank = false }: { roundBy?: ComputedRef<Prefix | number>, withBlank?: boolean } = {},
) {
  const { getCurrentTokenValue } = useFiatStore()

  const amountFormatted = computed(() => {
    const amount = tokenAmount.value
      ? formatAmountWithRound(tokenAmount.value, tokenDecimals.value, roundBy?.value)
      : 0
    return ((!amount || amount === '0') && withBlank) ? '--' : `${amount} ${chainSymbol.value}`
  })

  const amountUsd = computed(() => {
    const value = calculateUsdFromToken(
      Number(tokenAmount.value) * Math.pow(10, -tokenDecimals.value),
      Number(getCurrentTokenValue(chainSymbol.value)),
    )
    return typeof value === 'number' && value >= 0 ? `$${value}` : ''
  })

  return {
    formatted: amountFormatted,
    usd: amountUsd,
  }
}
