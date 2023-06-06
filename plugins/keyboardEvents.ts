import { shouldIgnoreKeyDownEvent } from '@/utils/keyboardEvents'

const keysPressed = {}

const bindGoToEvents = (event, app) => {
  const { accountId } = useAuth()
  const { urlPrefix } = usePrefix()

  let path = ''
  let query = {}

  switch (event.key) {
    case 'a':
      if (urlPrefix.value && accountId.value) {
        path = `/${urlPrefix.value}/u/${accountId.value}`
      }
      break
    case 'c':
      if (urlPrefix.value && accountId.value) {
        path = `/${urlPrefix.value}/u/${accountId.value}`
        query = { tab: 'collected' }
      }
      break
    case 's':
      if (urlPrefix.value && accountId.value) {
        path = `/${urlPrefix.value}/u/${accountId.value}`
        query = { tab: 'sold' }
      }
      break
    case 'm':
      if (urlPrefix.value) {
        path = `/${urlPrefix.value}/mint`
      }
      break
    case 't':
      path = '/transfer'
      break
    case 'i':
      path = '/series-insight'
      break
    case 'd':
      path = '/spotlight'
      break
  }
  if (path) {
    app.router.push({
      path: path,
      query: query,
    })
  }
}

const bindCopyEvents = (event) => {
  if (event.key == 'u') {
    const dummyElement: HTMLInputElement = document.createElement('input')
    const text = window.location.href

    document.body.appendChild(dummyElement)
    dummyElement.value = text
    dummyElement.select()
    document.execCommand('copy')
    document.body.removeChild(dummyElement)
    alert(`URL ${text} copied`)
  }
}

const listenGlobalKeyboardEvents = (app) => {
  document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (shouldIgnoreKeyDownEvent(event)) {
      return
    }

    keysPressed[event.key] = true
    if (keysPressed['g']) {
      bindGoToEvents(event, app)
    }
    if (keysPressed['c']) {
      bindCopyEvents(event)
    }

    if (event.key === '?') {
      const element: HTMLElement = document.querySelectorAll(
        '#keyboardShortcutsModal > .button'
      )[0] as HTMLElement
      element.click()
    }
  })

  document.addEventListener('keyup', (event) => {
    delete keysPressed[event.key]
  })
}

export default ({ app }): void => {
  listenGlobalKeyboardEvents(app)
}
