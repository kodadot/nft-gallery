import debounce from 'lodash/debounce'
import type { Actions } from '@/composables/transaction/types'

export default ({
  getActionFn,
  getActionFnDebounce = 200,
}) => {
  const { decimals, chainSymbol } = useChain()

  const autoTeleport = ref(false)
  const autoTeleportButton = ref()
  const autoTeleportLoaded = ref(false)
  const action = ref<Actions>(emptyObject<Actions>())

  const txFees = computed(() => autoTeleportButton.value?.optimalTransition.txFees || 0)
  const { formatted: formattedTxFees } = useAmount(txFees, decimals, chainSymbol)

  const updateAction = (value: Actions) => {
    action.value = value
  }

  const debouncedUpdateAction = debounce(updateAction, getActionFnDebounce)

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
      debouncedUpdateAction(getActionFn())
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
