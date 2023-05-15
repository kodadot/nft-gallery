import { ComponentPublicInstance, Ref, nextTick, ref } from 'vue'

export function useTextOverflow() {
  const isTextCut: Ref<boolean> = ref(false)

  const assignRef = (el: Element | ComponentPublicInstance | null) => {
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
