import consola from 'consola'
import { DialogProgrammatic as Dialog } from 'buefy'

import { clearSession } from '@/utils/cachingStrategy'

export default async () => {
  if ('serviceWorker' in navigator) {
    const { Workbox } = await import('workbox-window')
    const workbox = new Workbox('/sw.js')

    consola.info('workbox detected', workbox)

    workbox.addEventListener('installed', (event) => {
      consola.info(
        'App is being served from cache by a service worker.\n' +
          'For more details, visit https://pwa.nuxtjs.org/'
      )

      if (event.isUpdate || true) {
        consola.info('New content is available, please refresh.')
        Dialog.alert({
          message: 'The new version of Kodadot is here!',
          confirmText: 'Upgrade',
          type: 'is-success',
          onConfirm: async () => {
            clearSession()
          },
        })
      }
    })
  }
}
