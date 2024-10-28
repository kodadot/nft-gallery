const modals = ref(new Map<symbol, Ref>())

type ModalRef = Ref<{ isActive: boolean }>

export default function (modalRef: Ref) {
  const targetModals = ref<ModalRef[]>([])
  const symbol = Symbol()

  const otherModals = computed(() => {
    return Array.from(modals.value.keys())
      .filter(modal => modal !== symbol)
      .map(modal => modals.value.get(modal)) as ModalRef[]
  })

  const closeOthers = () => {
    for (const modal of otherModals.value) {
      if (modal.value?.isActive) {
        modal.value.isActive = false
        targetModals.value?.push(modal)
      }
    }
  }

  const openClosed = () => {
    for (const modal of targetModals.value) {
      modal.value.isActive = true
    }
    targetModals.value = []
  }

  onMounted(() => modals.value.set(symbol, modalRef))
  onUnmounted(() => modals.value.delete(symbol))

  return {
    closeOthers,
    openClosed,
  }
}
