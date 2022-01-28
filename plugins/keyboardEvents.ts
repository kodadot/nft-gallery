let account = null
let urlPrefix = null
const keysPressed = {}

const clickElement = (selector) => {
  if (selector) {
    const element: HTMLElement = document.querySelectorAll(
      selector
    )[0] as HTMLElement
    if (element) {
      element.click()
    }
  }
}

const bindItemDetailActionEvents = (event) => {
  const mappings = {
    b: '.buy-btn',
    s: '.send-btn',
    c: '.consume-btn',
    l: '.list-btn',
  }

  const selector = mappings[event.key]
  clickElement(selector)
}

const bindItemDetailEvents = (event) => {
  const mappings = {
    p: '.price-chart a',
    h: '.history-chart a',
    d: '.description-wrapper a',
  }

  const selector = mappings[event.key]
  clickElement(selector)
}

const bindGoToEvents = (event, app) => {
  let path = ''
  let query = {}
  switch (event.key) {
    case 'n':
      clickElement('.pagination-link.pagination-next:not([disabled])')
      break
    case 'p':
      clickElement('.pagination-link.pagination-previous:not([disabled])')
      break
    case 'a':
      path = `/${urlPrefix}/u/${account}`
      break
    case 'c':
      path = `/${urlPrefix}/u/${account}`
      query = { tab: 'collected' }
      break
    case 's':
      path = `/${urlPrefix}/u/${account}`
      query = { tab: 'sold' }
      break
    case 'm':
      path = `/${urlPrefix}/mint`
      break
    case 't':
      path = '/transfer'
      break
    case 'i':
      path = '/series-insight'
      break
  }
  app.router.push({
    path: path,
    query: query,
  })
}

const listenKeyboardEvents = (app) => {
  document.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true
    if (keysPressed['g']) {
      bindGoToEvents(event, app)
    }
    if (keysPressed['e']) {
      bindItemDetailEvents(event)
    }
    if (keysPressed['a']) {
      bindItemDetailActionEvents(event)
    }
  })

  document.addEventListener('keyup', (event) => {
    delete keysPressed[event.key]
  })
}

export default ({ app, store }) => {
  account = store.getters.getAuthAddress
  urlPrefix = store.getters.currentUrlPrefix

  listenKeyboardEvents(app)
}
