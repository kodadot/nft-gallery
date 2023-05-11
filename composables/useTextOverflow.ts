import { nextTick, ref } from 'vue'

export function useTextOverflow() {
  const textOverflowData = ref<
    Array<{ div: HTMLDivElement | null; isCut: boolean }>
  >([])

  const assignRefAndUpdate = (el: HTMLDivElement | null) => {
    if (el) {
      const index = textOverflowData.value.findIndex(
        (item) => item.div === null
      )
      if (index !== -1) {
        textOverflowData.value[index].div = el
        nextTick(() => {
          updateIsTextCutShort(index)
        })
      } else {
        textOverflowData.value.push({ div: el, isCut: false })
        nextTick(() => {
          updateIsTextCutShort(textOverflowData.value.length - 1)
        })
      }
    }
  }

  const updateIsTextCutShort = (index: number) => {
    const div = textOverflowData.value[index].div
    if (div) {
      textOverflowData.value[index].isCut = div.scrollWidth > div.clientWidth
    }
  }

  return {
    textOverflowData,
    assignRefAndUpdate,
  }
}
