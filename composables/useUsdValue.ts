import { Prefix } from '@kodadot1/static'

export default function useUsdValue() {
  const fiatStore = useFiatStore()
  const { urlPrefix } = usePrefix()

  const tokenFiatValue = computed(() => {
    const fiatValueMap: Record<Prefix, FiatPrice> = {
      rmrk: fiatStore.getCurrentKSMValue,
      bsx: fiatStore.getCurrentKSMValue,
      ksm: fiatStore.getCurrentKSMValue,
      snek: fiatStore.getCurrentKSMValue,
      ahk: fiatStore.getCurrentKSMValue,
      dot: fiatStore.getCurrentDOTValue,
      ahp: fiatStore.getCurrentDOTValue,
    }
    return Number(fiatValueMap[urlPrefix.value] ?? 0)
  })

  const toUsdPrice = (price: number | string) =>
    calculateExactUsdFromToken(Number(price), tokenFiatValue.value)

  return {
    toUsdPrice,
  }
}
