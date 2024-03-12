import { EntropyRange } from '@/composables/drop/useGenerativePreview'
import { ImageDataPayload } from '@/composables/drop/useGenerativeIframeData'
import { pinFileToIPFS } from '@/services/nftStorage'

export const getEntropyRange = (num: number, step = 64): EntropyRange => [
  step * num,
  step * (num + 1),
]

export const getCaptureImageFile = async ({
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

export const tryCapture = async ({
  image,
  data,
}: {
  image: string
  data: ImageDataPayload
}) => {
  try {
    const imgFile = await getCaptureImageFile({ image, data })
    const imageHash = await pinFileToIPFS(imgFile)
    return imageHash
  } catch (error) {
    // toast($i18n.t('drops.capture'))
    throw error
  }
}
