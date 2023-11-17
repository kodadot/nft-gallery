export default function useUsdValue() {
  const fiatStore = useFiatStore()
  const { urlPrefix } = usePrefix()

  const getTokenUsdValue = (token) => {
    const tokenMap = {
      ahk: fiatStore.getCurrentKSMValue,
      ksm: fiatStore.getCurrentKSMValue,
      rmrk: fiatStore.getCurrentKSMValue,
      bsx: fiatStore.getCurrentBSXValue,
      ahp: fiatStore.getCurrentDOTValue,
      dot: fiatStore.getCurrentDOTValue,
      ahr: fiatStore.getCurrentROCValue,
    }
    return Number(tokenMap[token] || 0)
  }

  const toUsdPrice = (price: number | string, token?: string) =>
    calculateExactUsdFromToken(
      Number(price),
      getTokenUsdValue(token ?? urlPrefix.value),
    )

  return {
    toUsdPrice,
  }
}
