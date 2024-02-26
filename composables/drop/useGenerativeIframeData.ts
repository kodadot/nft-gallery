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

  const getCaptureImageFile = async ({
    image,
    data: imageDataPayload,
  }: {
    image: string
    data: ImageDataPayload
  }) => {
    const selectedImageHash = image.split('?hash=')[1]
    const isTheSameImage = selectedImageHash === imageDataPayload?.hash
    if (!imageDataPayload?.image || !isTheSameImage) {
      throw new Error('Failed to load image, please try again later')
    }
    const res = (await fetch(imageDataPayload.image)) as any
    return new File([res], 'image.png', { type: 'image/png' })
  }

  return {
    imageDataPayload,
    imageDataLoaded,
    getCaptureImageFile,
  }
}
