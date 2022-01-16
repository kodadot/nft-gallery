import { NotificationProgrammatic as Notification } from 'buefy';

declare global {
  interface Window {
    $workbox: any;
  }
}

export default async () => {
  const workbox = await window.$workbox;
  if (workbox) {
    workbox.addEventListener('installed', (event) => {
      console.log(
        'App is being served from cache by a service worker.\n' +
          'For more details, visit https://pwa.nuxtjs.org/'
      );

      if (event.isUpdate) {
        console.log('New content is available, please refresh.');
        const notif = Notification.open({
          message: 'New version is ready. Close to upgrade.',
          queue: false,
          type: 'is-info is-dark',
          position: 'is-top-left',
          indefinite: true,
          hasIcon: true,
        });

        notif.$on('close', () => {
          window.sessionStorage.clear();
          window.localStorage.clear();
          window.location.reload();
        });
      }
    });
  }
};
