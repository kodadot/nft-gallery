/* eslint-disable no-console */

import { register } from 'register-service-worker';
import { NotificationProgrammatic as Notification } from 'buefy';

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' +
          'For more details, visit https://goo.gl/AFskqB'
      );
    },
    cached() {
      console.log('Content has been cached for offline use.');
    },
    updated() {
      console.log('New content is available; please refresh.');
      const notif = Notification.open({
        // duration: 4000,
        message: `New version of app is available. REFRESHING`,
        queue: false,
        type: 'is-info is-light',
        position: 'is-top-right',
      });

      // notif.$on('close', () => {
      //   window.sessionStorage.clear();
      //   window.location.reload()
      // })
    },
    offline() {
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    },
    error(error) {
      console.error('Error during service worker registration:', error);
    }
  });
}
