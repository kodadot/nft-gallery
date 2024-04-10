import { ref } from 'vue'

function loadImageOntoCanvas(base64Str: string) {
  return new Promise<{
    ctx: CanvasRenderingContext2D
    canvas: HTMLCanvasElement
  }>((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      ctx?.drawImage(img, 0, 0)
      resolve({ ctx, canvas })
    }
    img.onerror = reject
    img.src = base64Str
  })
}

function convertToGrayscale(ctx, canvas) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  // eslint-disable-next-line no-restricted-syntax
  for (let i = 0; i < data.length; i += 4) {
    // Calculate grayscale value
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
    data[i] = avg // Red
    data[i + 1] = avg // Green
    data[i + 2] = avg // Blue
  }
  ctx.putImageData(imageData, 0, 0)
}

export default function useImageComparison(base64Image1, base64Image2) {
  const areIdentical = ref()
  const diffPercent = 5 // Allowable percentage of differing pixels

  Promise.all([
    loadImageOntoCanvas(base64Image1),
    loadImageOntoCanvas(base64Image2),
  ])
    .then(([result1, result2]) => {
      const { ctx: ctx1, canvas: canvas1 } = result1
      const { ctx: ctx2, canvas: canvas2 } = result2

      // Convert both images to grayscale
      convertToGrayscale(ctx1, canvas1)
      convertToGrayscale(ctx2, canvas2)

      if (
        canvas1.width !== canvas2.width ||
        canvas1.height !== canvas2.height
      ) {
        areIdentical.value = false
        return
      }

      const imgData1 = ctx1.getImageData(0, 0, canvas1.width, canvas1.height)
      const imgData2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height)
      let diffPixels = 0

      // eslint-disable-next-line no-restricted-syntax
      for (let i = 0; i < imgData1.data.length; i += 4) {
        // Iterate over grayscale values
        if (Math.abs(imgData1.data[i] - imgData2.data[i]) > 0) {
          diffPixels += 1
        }
      }

      // Calculate the percentage of different pixels
      const totalPixels = imgData1.data.length / 4
      const diffPercentage = (diffPixels / totalPixels) * 100

      areIdentical.value = diffPercentage <= diffPercent
    })
    .catch((error) => {
      console.error('Failed to compare images:', error)
      areIdentical.value = false
    })

  return { areIdentical }
}
