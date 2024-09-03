import formatBalance, { formatNumber, withoutDigitSeparator } from '@/utils/format/balance'
import { prefixToToken } from '@/components/common/shoppingCart/utils'

export default function () {
  const fiatStore = useFiatStore()
  const { urlPrefix } = usePrefix()
  const { decimals, chainSymbol } = useChain()

  const tokenPrice = computed(() => Number(fiatStore.getCurrentTokenValue(prefixToToken[urlPrefix.value]) || 0))

  const format = (tokenAmount: string) => {
    const amount = formatBalance(String(tokenAmount), decimals.value, false)
    return {
      amount: `${amount} ${chainSymbol.value}`,
      price: `$${`${formatNumber(Number(withoutDigitSeparator(String(amount))) * tokenPrice.value)}`}`,
    }
  }

  return {
    format,
  }
}
