const URL_REGEX
  = /(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/

export const findUrlsFromText = (text: string) => {
  const matches = text.match(URL_REGEX)
  if (!matches) {
    return []
  }
  return matches
}

export function isExternal(url: string) {
  return !url.startsWith(window.location.origin)
}

export const removeHttpFromUrl = (url: string) =>
  url.replace(/^https?:\/\//, '')

export const addHttpToUrl = (url: string) =>
  url.startsWith('http') ? url : `https://${url}`
