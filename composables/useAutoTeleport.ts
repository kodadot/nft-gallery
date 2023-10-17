

import {allowedTransitions as teleportRoutes, prefixToChainMap, chainToPrefixMap } from "@/utils/teleport"

export default function (neededAmount: ComputedRef<number>) {
    const { urlPrefix } = usePrefix()
    const { balance , getBalance } = useBalance()
    const {fetchMultipleBalance} = useMultiBalance()

    const hasEnough = computed(() => neededAmount.value < balance.value)
    const targetChains = computed(() => teleportRoutes[prefixToChainMap[urlPrefix.value]])

    const targetChainsBalances = computed(() => targetChains.value.reduce((reducer, chainPrefix) => {
        const prefix =  chainToPrefixMap[chainPrefix]
        return {
            ...reducer, 
            [prefix]: getBalance('KSM', prefix)
        }
    }, {}))

    const hasEnoughInOtherChains = computed(() => Object.values(targetChainsBalances.value).some(Boolean))
    
    onMounted(async () => {
        await fetchMultipleBalance()
    })

    return {
        hasEnough,
        hasEnoughInOtherChains,
        // teleport: 
    }
}