

import {allowedTransitions as teleportRoutes, prefixToChainMap, chainToPrefixMap , TeleportTransition, Chain} from "@/utils/teleport"
import { max } from 'lodash'
import { CHAINS, type Prefix } from "@kodadot1/static"

export default function (neededAmount: ComputedRef<number>) {
    const { urlPrefix } = usePrefix()
    const {chainSymbol} = useChain()
    const {chainBalances } = useTeleport()
    const { fetchMultipleBalance } = useMultiBalance()
    
    const hasEnoughInCurrentChain = computed(() => neededAmount.value > Number(currentChainBalance.value))
    
    const currentChain = computed(() => prefixToChainMap[urlPrefix.value] as Chain)
    const targetChains = computed(() => teleportRoutes[currentChain.value])

    const currentChainBalance = computed(() => Number(chainBalances[currentChain.value]()))
    const sourceChainsBalances = computed(() => targetChains.value.reduce((reducer, chainPrefix) => {
        const prefix =  chainToPrefixMap[chainPrefix]
        return {
            ...reducer, 
            [prefix]: chainBalances[chainPrefix]()
        }
    }, {})
    )

    const richestChainBalance = computed<number>(() => Number(sourceChainsBalances.value[richestChain.value]))
    const richestChain = computed(() =>  max(Object.keys(sourceChainsBalances.value), (o: Prefix) => sourceChainsBalances.value[o]))
    const sourceChain = computed(() => CHAINS[richestChain.value])
    const amountToTeleport = computed(() => richestChainBalance.value - neededAmount.value + Number(currentChainBalance.value))
    const hasEnoughInRichestChain = computed(() => currentChainBalance.value + richestChainBalance.value > amountToTeleport.value)
    
    const { formatted: amountFormatted, usd: amountUsd } = useAmount(amountToTeleport.value, sourceChain.value.tokenDecimals,chainSymbol.value )

    const optimalTransition = computed<TeleportTransition>(() =>  {
        return {
            source: richestChain.value ? {
                chain: prefixToChainMap[richestChain.value] as Chain,
                prefix: richestChain.value,
                name: getChainName(richestChain.value)
            }: null,
            destination: {
                chain: prefixToChainMap[urlPrefix.value] as Chain,
                prefix: urlPrefix.value,
                name: getChainName(urlPrefix.value)
            },
            amount: amountToTeleport.value,
            amountFormatted: amountFormatted.value,
            amountUsd: amountUsd.value,
            token: chainSymbol.value,
        }
    })

    onMounted(async () => {
        await fetchMultipleBalance()
    })

    return {
        hasEnoughInCurrentChain,
        hasEnoughInRichestChain,
        optimalTransition,
    }
}