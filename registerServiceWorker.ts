/* eslint-disable no-console */

import { register } from 'register-service-worker'
import { NotificationProgrammatic as Notification } from 'buefy'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' +
          'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered(){
      console.log('Service worker has been registered.')
    },
    cached() {
      console.log('Content has been cached for offline use.')
    },
    updatefound() {
      console.log('New content is downloading.')
    },
    updated() {
      console.log('New content is available; please refresh.')
      const notif = Notification.open({
        // duration: 30000,
        message: 'New version is ready. Close to upgrade.',
        queue: false,
        type: 'is-info is-dark',
        position: 'is-top-left',
        indefinite: true,
        hasIcon: true,
      })

      notif.$on('close', () => {
        window.sessionStorage.clear()
        window.localStorage.clear()
        window.location.reload()
      })
    },
    offline() {
      console.log(
        'No internet connection found. App is running in offline mode.'
      )
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
