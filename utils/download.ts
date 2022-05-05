export const downloadImage = async (imageSrc: string, name = 'unnamed') => {
  if (!imageSrc) {
    return
  }
  const image = await fetch(imageSrc)
  const imageBlog = await image.blob()
  const imageURL = URL.createObjectURL(imageBlog)

  const link = document.createElement('a')
  link.href = imageURL
  link.download = name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  return link
}
