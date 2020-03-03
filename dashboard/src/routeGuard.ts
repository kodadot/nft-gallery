import Connector from '@vue-polkadot/vue-api';
import { NotificationProgrammatic as Notification } from 'buefy';


export const apiEnabled = (to: any, from: any, next: any) => {
  if (Connector.getInstance().api) {
    next();
  } else {
    Notification.open({
      duration: 7000,
      message: `API not loaded, please try later!`,
      queue: false,
      type: 'is-danger',
      position: 'is-top-right',
    });
  }
};
