import format from "@/utils/format/balance"

export default function (amount: number, tokenDecimals: number,chainSymbol: string) {
    const { getCurrentTokenValue } = useFiatStore()

    const amountFormatted = computed(() => format(amount,tokenDecimals,chainSymbol),)
    const amountUsd = computed(() => {
        const value = calculateUsdFromToken(
            Number(amount) * Math.pow(10, -tokenDecimals),
            Number(getCurrentTokenValue(chainSymbol)),
        )
        return `$${value}`
    })

    return {
        formatted: amountFormatted,
        usd: amountUsd
    }
}