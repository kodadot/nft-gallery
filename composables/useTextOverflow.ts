import { ComponentPublicInstance, Ref, nextTick, ref } from 'vue'

export function useTextOverflow() {
  const element: Ref<HTMLElement | null> = ref(null)
  const isCut: Ref<boolean> = ref(false)

  const assignRefAndUpdate = (el: Element | ComponentPublicInstance | null) => {
    if (el && el instanceof HTMLElement) {
      element.value = el
      updateIsTextCutShort()
    }
  }

  const updateIsTextCutShort = () => {
    nextTick(() => {
      const el = element.value
      if (el && el.scrollWidth && el.clientWidth) {
        isCut.value = el.scrollWidth > el.clientWidth
      }
    })
  }

  return {
    assignRefAndUpdate,
    isCut,
  }
}
