import { nextTick } from 'vue'

export function useTextOverflow() {
  const isTextCut = ref<boolean>(false)

  const assignRef = (el: Element | null) => {
    if (el && el instanceof HTMLElement) {
      updateIsTextCutShort(el)
    }
  }

  const updateIsTextCutShort = (el: HTMLElement) => {
    nextTick(() => {
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
