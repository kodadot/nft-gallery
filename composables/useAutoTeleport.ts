

export default function (neededAmount: ComputedRef<number>) {
    const {hasEnoughInCurrentChain, hasEnoughInRichestChain, optimalTransition } = useAutoTeleportTransitionDetails(neededAmount)
    
    // const { teleport: sendXCM } = useTeleport()
    
    // const teleport = () => {

    // }

    return {
        hasEnoughInCurrentChain,
        hasEnoughInRichestChain,
        optimalTransition,
        // teleport 
    }
}