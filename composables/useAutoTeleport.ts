import { TransactionStatus } from "@/composables/useTransactionStatus"


type TransactionDetails = {
    status: ComputedRef<TransactionStatus>
    txId: ComputedRef<string | null>
    error: ComputedRef<string | null>
}

export type AutoTeleportTransactionStatus = {
    bridge: TransactionDetails
    action: TransactionDetails
}

export default function (neededAmount: ComputedRef<number>) {
    const { hasEnoughInCurrentChain, hasEnoughInRichestChain, optimalTransition } = useAutoTeleportTransitionDetails(neededAmount)

    const { teleport: sendXCM, getAddressByChain, status: teleportStatus, txId: teleportTxId,error: teleportError } = useTeleport()

    const status = computed<AutoTeleportTransactionStatus>(() => ({
        bridge: { status: computed(() => teleportStatus.value), txId: computed(() => teleportTxId.value), error: computed(() => teleportError.value) },
        action: { status: computed(() => TransactionStatus.Finalized), txId: computed(() => TransactionStatus.Finalized), error: computed(() => TransactionStatus.Finalized) },
    }))

    const teleport = async ({ onSuccess, onError }) => {

        const { destination, source, token, amount } = optimalTransition.value

        if (!source) {
            onError()
            return
        }

        await sendXCM({
            amount: amount,
            from: source?.chain,
            to: destination.chain,
            fromAddress: getAddressByChain(source?.chain),
            toAddress: getAddressByChain(destination?.chain),
            currency: token,
            onError: onError
        })
    }

    return {
        hasEnoughInCurrentChain,
        hasEnoughInRichestChain,
        optimalTransition,
        status,
        teleport
    }
}