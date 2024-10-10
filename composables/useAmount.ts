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
    return formatAmountWithSymbol(amount, { withBlank })
  })

  const amountUsd = computed(() => {
    const value = calculateUsdFromToken(
      Number(tokenAmount.value) * Math.pow(10, -tokenDecimals.value),
      Number(getCurrentTokenValue(chainSymbol.value)),
    )
    return formatAmountWithSymbol(value, { isUsd: true })
  })

  const formatAmountWithSymbol = (
    amount: string | number,
    { withBlank = false, isUsd = false }: { withBlank?: boolean, isUsd?: boolean } = {},
  ) => {
    return isUsd
      ? (typeof amount === 'number' && amount >= 0 ? `$${amount}` : '')
      : (!Number(amount) && withBlank ? '--' : `${amount} ${chainSymbol.value}`)
  }

  return {
    formatted: amountFormatted,
    usd: amountUsd,
  }
}
