const URL_REGEX =
  /(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/

export const findUrlsFromText = (text: string) => {
  const matches = text.match(URL_REGEX)
  if (!matches) {
    return []
  }
  return matches
}

export const convertSingularCollectionUrlToKodadotUrl = (url: string) => {
  try {
    const { origin } = useRequestURL()
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    if (
      urlObj.hostname === 'singular.app' &&
      pathname.startsWith('/collections/')
    ) {
      const regex = new RegExp('/collections/(kusama/)?', 'g')
      const collectionId = pathname.replace(regex, '')
      return `${origin}/ksm/collection/${collectionId}`
    }
  } catch (e) {
    // ignore invalid url error
  }

  return url
}

export const replaceSingularCollectionUrlByText = (text: string) => {
  const urls = findUrlsFromText(text)
  urls.forEach((url) => {
    text = text.replaceAll(url, convertSingularCollectionUrlToKodadotUrl(url))
  })
  return text
}

export function isExternal(url: string) {
  const { origin } = useRequestURL()

  return !url.startsWith(origin)
}
