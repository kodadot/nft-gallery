const keysPressed = {}

const bindGoToEvents = (event, app, store) => {
  const account = store.getters.getAuthAddress
  const urlPrefix = store.getters.currentUrlPrefix

  let path = ''
  let query = {}

  switch (event.key) {
    case 'a':
      if (urlPrefix && account) {
        path = `/${urlPrefix}/u/${account}`
      }
      break
    case 'c':
      if (urlPrefix && account) {
        path = `/${urlPrefix}/u/${account}`
        query = { tab: 'collected' }
      }
      break
    case 's':
      if (urlPrefix && account) {
        path = `/${urlPrefix}/u/${account}`
        query = { tab: 'sold' }
      }
      break
    case 'm':
      if (urlPrefix) {
        path = `/${urlPrefix}/mint`
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

const listenGlobalKeyboardEvents = (app, store) => {
  document.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true
    if (keysPressed['g']) {
      bindGoToEvents(event, app, store)
    }
    if (keysPressed['c']) {
      bindCopyEvents(event)
    }

    if (event.key === '?') {
      const element: HTMLElement = document.getElementById(
        'keyboardShortcutsModal'
      ) as HTMLElement
      element.click()
    }
  })

  document.addEventListener('keyup', (event) => {
    delete keysPressed[event.key]
  })
}

export default ({ app, store }) => {
  listenGlobalKeyboardEvents(app, store)
}
