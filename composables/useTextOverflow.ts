export function useTextOverflow() {
  const { $nextTick } = useNuxtApp()
  const isTextCut = ref<boolean>(false)

  const assignRef = (el: Element | null) => {
    if (el && el instanceof HTMLElement) {
      updateIsTextCutShort(el)
    }
  }

  const updateIsTextCutShort = (el: HTMLElement) => {
    $nextTick(() => {
      if (el && el.scrollWidth && el.clientWidth) {
        isTextCut.value = el.scrollWidth > el.clientWidth
      }
    })
  }

  return {
    assignRef,
    isTextCut,
  }
}
