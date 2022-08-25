import { NotificationProgrammatic as Notification } from 'buefy'

declare global {
  interface Window {
    $workbox: any
  }
}

export default async () => {
  const workbox = await window.$workbox

  const flushIndexedDb = async () => {
    if (window.indexedDB && typeof window.indexedDB.databases !== 'undefined') {
      const databases = await window.indexedDB.databases()
      for (const db of databases) {
        await window.indexedDB.deleteDatabase(db.name || '')
      }
    }
  }

  if (workbox) {
    workbox.addEventListener('installed', (event) => {
      console.log(
        'App is being served from cache by a service worker.\n' +
          'For more details, visit https://pwa.nuxtjs.org/'
      )

      if (event.isUpdate) {
        console.log('New content is available, please refresh.')
        const notif = Notification.open({
          message: 'New version is ready. Close to upgrade.',
          queue: false,
          type: 'is-info is-dark',
          position: 'is-top-left',
          indefinite: true,
          hasIcon: true,
        })

        notif.$on('close', async () => {
          try {
            window.sessionStorage.clear()
            window.localStorage.clear()
            await flushIndexedDb()
          } catch (error) {
            console.error(error)
          } finally {
            window.location.reload()
          }
        })
      }
    })
  }
}
