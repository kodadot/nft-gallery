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
    return formatToBlank(amount, withBlank)
  })

  const amountUsd = computed(() => {
    const value = calculateUsdFromToken(
      Number(tokenAmount.value) * Math.pow(10, -tokenDecimals.value),
      Number(getCurrentTokenValue(chainSymbol.value)),
    )
    return typeof value === 'number' && value >= 0 ? `$${value}` : ''
  })

  const formatToBlank = (amount: string | number, withBlank?: boolean) => {
    return !Number(amount) && withBlank ? '--' : `${amount} ${chainSymbol.value}`
  }

  return {
    formatted: amountFormatted,
    usd: amountUsd,
  }
}
