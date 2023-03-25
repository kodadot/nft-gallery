import {
  EXTERNAL_LINK_BLACKLIST,
  EXTERNAL_LINK_WHITELIST,
} from '../utils/constants'

function isExternal(url: string) {
  return !url.startsWith(window.location.origin)
}

function getRedirectUrl(url: string) {
  const urlObj = new URL(url)
  const redirectHost = urlObj.host.toLocaleLowerCase()
  if (EXTERNAL_LINK_WHITELIST.includes(redirectHost)) {
    return url
  }
  const redirectUrl = encodeURIComponent(url)
  if (EXTERNAL_LINK_BLACKLIST.includes(redirectHost)) {
    return `/redirect?redirect=${redirectUrl}&warn=blacklist`
  }
  return `/redirect?redirect=${redirectUrl}`
}

function handleLink() {
  document.body.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).tagName === 'A') {
      const target = event.target as HTMLLinkElement
      if (isExternal(target.href)) {
        event.preventDefault()
        window.open(target.href)
      }
    }
  })
}

function handleOpen() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _window = window as any
  _window._open = _window._open || _window.open
  window.open = (url, target, ...args) => {
    let redirectUrl = url
    if (isExternal(url as string)) {
      redirectUrl = getRedirectUrl(url as string)
      target = '_blank'
    }
    _window._open(redirectUrl, target, ...args)
    return window
  }
}

document.addEventListener('DOMContentLoaded', () => {
  handleLink()
  handleOpen()
})
