export const downloadImage = async (imageSrc: string, name = 'unnamed') => {
  if (!imageSrc) {
    return
  }
  const image = new Image()
  image.src = imageSrc
  image.crossOrigin = 'Anonymous'
  image.onload = async function () {
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const ctx = canvas.getContext('2d')
    ctx?.drawImage(image, 0, 0)
    ctx?.save()
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/webp'),
    )
    // const dataUrl = canvas.toDataURL('image/png')
    const downloadLink = document.createElement('a')
    downloadLink.href = URL.createObjectURL(blob)
    downloadLink.download = name

    // Trigger the download
    downloadLink.click()
  }
}

export const downloadBase64Image = (base64: string, name = 'unnamed') => {
  const a = document.createElement('a')
  a.href = base64
  a.download = name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
