import { NotificationProgrammatic as Notification } from 'buefy'

export type NotificationType = { type: string, actionText: string }
export type AvailableNotification = 'success' | 'info' | 'danger' | 'warn'
export type NotificationList = Record<AvailableNotification, NotificationType>


export const notificationTypes: NotificationList = {
  success: {
    type: 'is-success',
    actionText: 'OK',
    // onAction: () => window.open(this.explorer + this.tx, '_blank'),
  },
  info: {
    type: 'is-info',
    actionText: 'OK',
  },
  danger: {
    type: 'is-danger',
    actionText: 'Oh no!',
  },
  warn: {
    type: 'is-warning',
    actionText: 'Oh ok!',
  },
}


export const showNotification = (message: string | null, params: any = notificationTypes.info): void  => {
  Notification.open({
    duration: 5000,
    message,
    type: 'is-success',
    position: 'is-top-right',
    actionText: 'OK',
    queue: false,
    ...params,
  })
}

export const infiniteNotif = (message: string) => {
  const notif = Notification.open({
    indefinite: true,
    message,
    type: 'is-info is-light',
    position: 'is-top',
    queue: false,
  })

  return notif
}
