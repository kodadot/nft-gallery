self.addEventListener('install', function (e) {
  console.log('installListener')
  self.skipWaiting()
})

self.addEventListener('activate', function (e) {
  console.log('activeListener')
  self.registration
    .unregister()
    .then(function () {
      console.log('unregister')
      return self.clients.matchAll()
    })
    .then(function (clients) {
      // maybe this is not needed at all and leaving as very last option to try
      // window.sessionStorage.clear()
      // window.localStorage.clear()
      // window.location.reload()
      clients.forEach((client) => client.navigate(client.url))
    })
})
