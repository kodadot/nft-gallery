import '@paraport/sdk/style'
import * as paraport from '@paraport/sdk'
import { type Prefix } from '@kodadot1/static'
import { checkIfAutoTeleportActionsNeedRefetch } from '@/composables/autoTeleport/utils'
import type { Actions } from '@/composables/transaction/types'
import { getChainCurrency } from '@/utils/teleport'
import type {
  AutoTeleportAction,
  AutoTeleportFeeParams,
} from '@/composables/autoTeleport/types'

const DEFAULT_AUTO_TELEPORT_FEE_PARAMS = {
  actionAutoFees: true,
  actions: 0,
  forceActionAutoFees: false,
}

export default ({
  amount,
  fees,
  actions,
  label,
  disabled,
  onAddFunds,
  onAction,
  targetId,
  mountable,
}: {
  amount: Ref<number>
  fees: Ref<AutoTeleportFeeParams | undefined>
  actions: Ref<AutoTeleportAction[]>
  targetId: string
  label: Ref<string>
  disabled: Ref<boolean>
  onAddFunds: () => void
  onAction: () => void
  mountable: Ref<boolean>
}) => {
  const { accountId } = useAuth()
  const { chain: currentChain, getAddressByChain } = useTeleport()

  const paraportSession = ref<ReturnType<typeof paraport.init>>()
  const paraportTxFees = ref(0)
  const isReady = ref()
  const needed = ref(false)
  const available = ref(false)

  const actionTxFees = reactive<{ fetched: boolean, value: number[] }>({
    fetched: false,
    value: [],
  })

  const actionsId = computed(() =>
    actions.value.map(({ action }) => JSON.stringify(action)).join('_') + mountable.value,
  )

  const actionAutoFees = computed(() => ({ ...fees.value, ...DEFAULT_AUTO_TELEPORT_FEE_PARAMS }))

  const chainSymbol = computed(
    () => currentChain.value && getChainCurrency(currentChain.value),
  )

  const totalAmount = computed(() => String(amount.value + sum(actionTxFees.value)))
  const txFees = computed(() => sum(actionTxFees.value) + paraportTxFees.value)

  const initSession = () => {
    paraportSession.value = paraport.init({
      integratedTargetId: targetId,
      label: label.value,
      disabled: disabled.value,
      autoteleport: {
        address: accountId.value,
        amount: totalAmount.value,
        chain: currentChain.value,
        asset: chainSymbol.value,
      },
      onReady: (session) => {
        paraportTxFees.value = Number(session.quotes.selected?.fees.total)
        available.value = Boolean(session.quotes.selected) && Boolean(session.funds.available)
        needed.value = Boolean(session.funds.needed)
        isReady.value = true
      },
      onSubmit: ({ autoteleport, completed }) => {
        if (!autoteleport || completed) {
          onAction()
        }
      },
      onAddFunds,
    })
  }

  const reset = () => {
    actionTxFees.value = []
    actionTxFees.fetched = false
    paraportTxFees.value = 0
    isReady.value = undefined
    needed.value = false
    available.value = false
  }

  const destroy = () => {
    paraportSession.value?.destroy()
    reset()
  }

  watch(
    [actionsId, actions],
    async ([id, actions], [prevId, prevActions]) => {
      if (!mountable.value) {
        return
      }

      if (
        id !== prevId
        && actionAutoFees.value
        && checkIfAutoTeleportActionsNeedRefetch(actions, prevActions)
      ) {
        try {
          actionTxFees.fetched = false
          const address = getAddressByChain(currentChain.value as Chain)
          const feesPromisses = actions.map(async ({ action, prefix }) => {
            return getActionTransactionFee({
              action: action as Actions,
              address,
              prefix: (prefix || (action as Actions).urlPrefix) as Prefix,
            })
          })
          const fees = await Promise.all(feesPromisses)
          actionTxFees.value = fees.map(Number)
        }
        catch (error) {
          console.error(`[AUTOTELEPORT]: Failed getting action fee  ${error}`)
        }
        finally {
          actionTxFees.fetched = true
        }
      }
    },
    { immediate: true },
  )

  watchEffect(() => {
    if (actionTxFees.fetched && mountable.value) {
      initSession()
    }
    else if (!mountable.value) {
      destroy()
    }
  })

  return {
    needed,
    available,
    isReady,
    txFees,
  }
}
