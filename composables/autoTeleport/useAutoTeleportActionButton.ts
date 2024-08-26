import type { Actions } from '@/composables/transaction/types'

export default ({
  getActionFn,
}) => {
  const autoTeleport = ref(false)
  const autoTeleportButton = ref()
  const autoTeleportLoaded = ref(false)
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
    autoTeleport,
    autoTeleportButton,
    autoTeleportLoaded,
  }
}
