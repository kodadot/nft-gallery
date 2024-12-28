import type { Actions } from '@/composables/transaction/types'

type AutoTeleportActionButtonParams<T> = {
  getActionFn: () => T
  disabled?: MaybeRef<boolean>
}

export default <T = Actions>({
  getActionFn,
  disabled = false,
}: AutoTeleportActionButtonParams<T>) => {
  const { decimals, chainSymbol } = useChain()

  const autoTeleport = ref(false)
  const autoTeleportButton = ref()
  const autoTeleportLoaded = ref(false)
  const action = ref<T>(emptyObject<T>())

  const txFees = computed(() => autoTeleportButton.value?.optimalTransition.txFees || 0)
  const isActionReady = computed(() => Boolean(Object.keys(action.value).length)) // TODO: allow nullish action
  const { formatted: formattedTxFees } = useAmount(txFees, decimals, chainSymbol)

  watch(
    () => autoTeleportButton.value?.isReady,
    () => {
      if (autoTeleportButton.value?.isReady && !autoTeleportLoaded.value) {
        autoTeleportLoaded.value = true
      }
    },
  )

  watchSyncEffect(() => {
    if (!autoTeleport.value && !unref(disabled)) {
      action.value = getActionFn()
    }
  })

  return {
    action,
    autoTeleport,
    autoTeleportButton,
    autoTeleportLoaded,
    txFees,
    formattedTxFees,
    isActionReady,
  }
}
