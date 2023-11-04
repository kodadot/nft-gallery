import format from '@/utils/format/balance'

export default function (
  tokenAmount: ComputedRef<number>,
  tokenDecimals: ComputedRef<number>,
  chainSymbol: ComputedRef<string>,
) {
  const { getCurrentTokenValue } = useFiatStore()

  const amountFormatted = computed(() =>
    format(tokenAmount.value, tokenDecimals.value, chainSymbol.value),
  )
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
