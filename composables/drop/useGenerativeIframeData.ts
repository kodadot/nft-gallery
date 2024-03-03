import { useEventListener } from '@vueuse/core'

export type ImageDataPayload = { hash: string; image: string }

export default ({
  onMessage,
}: { onMessage?: (dataPayload: ImageDataPayload) => void } = {}) => {
  const imageDataPayload = ref<ImageDataPayload>()
  const imageDataLoaded = computed(() => !!imageDataPayload.value)

  useEventListener(window, 'message', (res) => {
    if (
      res?.data?.type === 'kodahash/render/completed' &&
      res?.data?.payload.image
    ) {
      const payload = res?.data?.payload
      imageDataPayload.value = payload
      onMessage?.(payload)
    }
  })

  return {
    imageDataPayload,
    imageDataLoaded,
  }
}
