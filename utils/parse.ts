export const extractTwitterIdFromDescription = (desc: string = '') => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/(?:\#!\/)?@?([^\/\?\s)]+)/

  const match = desc.match(regex)
  if (match) {
    return match[1].replace('@', '')
  }

  return ''
}
