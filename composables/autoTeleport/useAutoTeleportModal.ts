const modals = ref(new Map<symbol, { isOpen: boolean }>())

export default () => {
  const isModalOpen = ref(false)
  const symbol = Symbol()

  watch(isModalOpen, (isOpen) => {
    modals.value.set(symbol, { isOpen })
  })

  const isAutoTeleportModalOpen = computed(
    () =>
      modals.value.size
      && Array.from(modals.value.values())
        .map(modal => modal.isOpen)
        .some(Boolean),
  )

  return {
    isModalOpen,
    isAutoTeleportModalOpen,
  }
}
