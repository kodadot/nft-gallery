import type { Actions } from '@/composables/transaction/types'

export default <T = Actions>({
  getActionFn,
}) => {
  const { decimals, chainSymbol } = useChain()

  const autoTeleport = ref(false)
  const autoTeleportButton = ref()
  const autoTeleportLoaded = ref(false)
  const action = ref<T>(emptyObject<T>())

  const txFees = computed(() => autoTeleportButton.value?.optimalTransition.txFees || 0)
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
    if (!autoTeleport.value) {
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
  }
}
