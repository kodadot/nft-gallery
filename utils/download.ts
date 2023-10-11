export const downloadImage = async (imageSrc: string, name = 'unnamed') => {
  if (!imageSrc) {
    return
  }

  const { data } = await useFetch(imageSrc)
  const image = data.value

  if (!(image instanceof Blob)) {
    return
  }

  const link = document.createElement('a')
  link.href = URL.createObjectURL(image)
  link.download = name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  return link
}
