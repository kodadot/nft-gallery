import MessageNotify from '@/components/MessageNotify.vue'
import Notification from '@/components/common/Notification.vue'

import {
  type NeoMessageVariant,
  NeoNotificationProgrammatic as Notif,
} from '@kodadot1/brick'
import consola from 'consola'
import { h } from 'vue'

type Params = {
  variant: NeoMessageVariant
  duration?: number
}

export const notificationTypes: Record<string, Params> = {
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

const getAction = ({
  variant,
  message,
}: {
  variant: NeoMessageVariant
  message: string
}) => {
  const { $i18n } = useNuxtApp()

  switch (variant) {
    case 'info':
      return { label: $i18n.t('helper.learnMore'), url: '' }
    case 'danger':
    case 'warning':
      return {
        label: $i18n.t('helper.reportIssue'),
        url: getGithubReportUrl(message),
      }
    default:
      return undefined
  }
}

export const showNotification = ({
  title,
  message,
  params = notificationTypes.info,
  duration = 10000,
}: {
  title: string
  message: string | null
  params?: Params
  duration?: number
}): void => {
  if (params === notificationTypes.danger) {
    consola.error('[Notification Error]', message)
    return
  }

  duration = params.duration || duration

  const componentParams = {
    component: h(Notification, {
      title: title,
      message: message!,
      variant: params.variant,
      duration: duration,
      action: getAction({ variant: params.variant, message: message ?? '' }),
    }),
    variant: 'component',
    duration: 50000, // child component will trigger close when the real duration is ended
  }

  Notif.open(
    params.variant === 'success'
      ? {
          message,
          duration: duration,
          closable: true,
        }
      : componentParams,
  )
}

export const showLargeNotification = ({
  message,
  title,
  duration = 10000,
  shareLink = undefined,
}: {
  message: string
  title?: string
  duration?: number
  shareLink?: string
}): void => {
  Notif.open({
    component: h(MessageNotify, {
      title: title,
      subtitle: message,
      noToast: true,
      shareLink,
    }),
    duration,
    variant: 'component',
    closable: true,
  })
}

export const infoMessage = (message) =>
  showNotification({
    title: 'Information',
    message,
    params: notificationTypes.info,
  })
export const successMessage = (message) =>
  showNotification({
    title: 'Succes',
    message: `[SUCCESS] ${message}`,
    params: notificationTypes.success,
  })
export const warningMessage = (message) =>
  showNotification({
    title: 'Warning',
    message,
    params: notificationTypes.warn,
  })
export const dangerMessage = (message) =>
  showNotification({
    title: 'Critical Error',
    message,
    params: notificationTypes.danger,
  })
