import { TransactionStatus } from "@/composables/useTransactionStatus"
import { Actions } from '@/composables/transaction/types';


type TransactionDetails = {
    status: ComputedRef<TransactionStatus>
    txId: ComputedRef<string | null>
    error: ComputedRef<string | null>
}

export type AutoTeleportTransactionStatus = {
    bridge: TransactionDetails
    action: TransactionDetails
}

export default function (action: Actions, neededAmount: ComputedRef<number>) {
    const { hasEnoughInCurrentChain, hasEnoughInRichestChain, optimalTransition } = useAutoTeleportTransitionDetails(neededAmount)

    const { teleport: sendXCM, getAddressByChain, status: teleportStatus, txId: teleportTxId,error: teleportError, canTeleport } = useTeleport()
    const { transaction: actionTransaction , status: actionStatus, isLoading: actionIsLoading } = useTransaction()


    const status = computed<AutoTeleportTransactionStatus>(() => ({
        bridge: { status: computed(() => teleportStatus.value), txId: computed(() => teleportTxId.value), error: computed(() => teleportError.value) },
        action: { status: computed(() => actionStatus.value), txId: computed(() => ''), error: computed(() => '') },
    }))

    const transaction = async () => {
        await actionTransaction(action)
    }

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

        // actionTransaction(action)
    }

    return {
        hasEnoughInCurrentChain,
        hasEnoughInRichestChain,
        optimalTransition,
        status,
        teleport,
        canTeleport,
        transaction
    }
}