import { useEventListener } from '@vueuse/core'

export default () => {
  const imageDataPayload = ref<{ hash: string; image: string }>()
  const imageDataLoaded = computed(() => !!imageDataPayload.value)
  useEventListener(window, 'message', (res) => {
    if (
      res?.data?.type === 'kodahash/render/completed' &&
      res?.data?.payload.image
    ) {
      imageDataPayload.value = res?.data?.payload
    }
  })

  return {
    imageDataPayload,
    imageDataLoaded,
  }
}
