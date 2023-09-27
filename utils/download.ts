export const downloadImage = async (imageSrc: string, name = 'unnamed') => {
  if (!imageSrc) {
    return
  }

  const { $consola } = useNuxtApp()

  let resp
  try {
    resp = await useFetch(imageSrc)
  } catch (error) {
    $consola.warn('[ERR] unable to fetch image')
    return
  }

  const image = resp.data.value
  if (!(image instanceof Blob)) {
    return
  }
  const imageURL = URL.createObjectURL(image)

  const link = document.createElement('a')
  link.href = imageURL
  link.download = name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  return link
}
