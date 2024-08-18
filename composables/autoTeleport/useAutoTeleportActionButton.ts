import type { Actions } from '@/composables/transaction/types'

export default ({
  autoTeleport,
  autoTeleportButton,
  autoTeleportLoaded,
  getActionFn,
}) => {
  const action = ref<Actions>(emptyObject<Actions>())

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
  }
}
