import format, { roundAmount } from '@/utils/format/balance'

export default function (
  tokenAmount: ComputedRef<number | string | undefined>,
  tokenDecimals: ComputedRef<number>,
  chainSymbol: ComputedRef<string>,
  round: undefined | number = undefined,
) {
  const { getCurrentTokenValue } = useFiatStore()

  const amountFormatted = computed(() => {
    const amount = format(tokenAmount.value, tokenDecimals.value, '')
    return `${round ? roundAmount(amount, round, false) : amount} ${
      chainSymbol.value
    }`
  })

  const amountUsd = computed(() => {
    const value = calculateUsdFromToken(
      Number(tokenAmount.value) * Math.pow(10, -tokenDecimals.value),
      Number(getCurrentTokenValue(chainSymbol.value)),
    )
    return value ? `$${value}` : ''
  })

  return {
    formatted: amountFormatted,
    usd: amountUsd,
  }
}
