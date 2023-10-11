import MessageNotify from '@/components/MessageNotify.vue'
import { NeoNotificationProgrammatic as Notif } from '@kodadot1/brick'
import consola from 'consola'
import { h } from 'vue'

export const notificationTypes = {
  success: {
    variant: 'success',
  },
  info: {
    variant: 'info',
  },
  danger: {
    variant: 'danger',
    duration: 15000,
  },
  warn: {
    variant: 'warning',
  },
}

export const showNotification = (
  message: string | null,
  params: any = notificationTypes.info,
  duration = 10000,
): void => {
  if (params === notificationTypes.danger) {
    consola.error('[Notification Error]', message)
    return
  }

  Notif.open({
    message,
    duration,
    closable: true,
    ...params,
  })
}

export const showLargeNotification = ({
  message,
  title,
  duration = 10000,
}: {
  message: string
  title?: string
  duration?: number
}): void => {
  Notif.open({
    component: h(MessageNotify, {
      title: title,
      subtitle: message,
      noToast: true,
    }),
    duration,
    variant: 'component',
    closable: true,
  })
}

export const infoMessage = (msg) =>
  showNotification(`[INFO] ${msg}`, notificationTypes.info)
export const successMessage = (msg) =>
  showNotification(`[SUCCESS] ${msg}`, notificationTypes.success)
export const warningMessage = (msg) =>
  showNotification(`[WARN] ${msg}`, notificationTypes.warn)
export const dangerMessage = (msg) =>
  showNotification(`[ERR] ${msg}`, notificationTypes.warn)
