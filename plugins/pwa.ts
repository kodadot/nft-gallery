import { NeoNotificationProgrammatic as Notification } from '@kodadot1/brick'
import consola from 'consola'

import { clearSession } from '@/utils/cachingStrategy'

// export default async () => {
export default defineNuxtPlugin(async () => {
  if ('serviceWorker' in navigator) {
    const { Workbox } = await import('workbox-window')
    const workbox = new Workbox('/sw.js')

    consola.info('workbox detected', workbox)

    workbox.addEventListener('installed', (event) => {
      consola.info(
        'App is being served from cache by a service worker.\n' +
          'For more details, visit https://pwa.nuxtjs.org/'
      )

      if (event.isUpdate) {
        consola.info('New content is available, please refresh.')
        const notif = Notification.open({
          message: 'New version is ready. Close to upgrade.',
          queue: false,
          type: 'is-info is-dark',
          position: 'is-top-left',
          indefinite: true,
          hasIcon: true,
        })

        notif.$on('close', () => {
          clearSession()
        })
      }
    })
  }
})
