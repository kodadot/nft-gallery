let account = null
let urlPrefix = null
const keysPressed = {}

const bindGoToEvents = (event, app) => {
  let path = ''
  let query = {}
  switch (event.key) {
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
