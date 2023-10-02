export const downloadImage = async (imageSrc: string, name = 'unnamed') => {
  if (!imageSrc) {
    return
  }

  const { $i18n, $consola } = useNuxtApp()
  const { toast } = useToast()

  try {
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
  } catch (error) {
    $consola.warn('[ERR] unable to fetch image')
    toast($i18n.t('toast.downloadError'))
    return
  }
}
