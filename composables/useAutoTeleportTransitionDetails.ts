

import {allowedTransitions as teleportRoutes, prefixToChainMap, chainToPrefixMap , TeleportTransition, type Chain, getChainCurrency} from "@/utils/teleport"
import { CHAINS, Config, type Prefix } from "@kodadot1/static"
import { max } from 'lodash'

export default function (neededAmount: ComputedRef<number>) {
    const { urlPrefix } = usePrefix()
    const { chainBalances , canTeleport, chain: currentChain } = useTeleport()
    const { fetchMultipleBalance } = useMultiBalance()

    const hasEnoughInCurrentChain = computed(() => neededAmount.value > Number(currentChainBalance.value))
    const chainSymbol = computed(() => currentChain.value && getChainCurrency(currentChain.value))
    const targetChains = computed(() => currentChain.value ? teleportRoutes[currentChain.value]: [])

    const currentChainBalance = computed(() => currentChain.value && Number(chainBalances[currentChain.value]()))
    const sourceChainsBalances = computed(() => targetChains.value.reduce((reducer, chainPrefix) => {
        const prefix =  chainToPrefixMap[chainPrefix]
        return {
            ...reducer, 
            [prefix]: chainBalances[chainPrefix]()
        }
    }, {})
    )

    const richestChain = computed<Chain| undefined>(() =>  max(Object.keys(sourceChainsBalances.value), (o: Prefix) => sourceChainsBalances.value[o]))
    const richestChainBalance = computed(() => richestChain.value ? Number(sourceChainsBalances.value[richestChain.value]): 0)
    
    const sourceChain = computed<Config<ChainProperties>|undefined>(() => richestChain.value && CHAINS[richestChain.value])
    const amountToTeleport = computed(() => richestChainBalance.value - neededAmount.value + Number(currentChainBalance.value))
    const hasEnoughInRichestChain = computed(() => (currentChainBalance.value|| 0) + (richestChainBalance.value || 0) > amountToTeleport.value)
    
    const { formatted: amountFormatted, usd: amountUsd } = useAmount(amountToTeleport, computed(() => sourceChain.value?.tokenDecimals ), chainSymbol)

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
        canTeleport,
        hasEnoughInCurrentChain,
        hasEnoughInRichestChain,
        optimalTransition,
    }
}