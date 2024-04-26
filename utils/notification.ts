import MessageNotify from '@/components/MessageNotify.vue'
import Notification from '@/components/common/Notification.vue'

import {
  type NeoMessageVariant,
  NeoNotificationProgrammatic as Notif,
} from '@kodadot1/brick'
import consola from 'consola'
import { h } from 'vue'

type NotificationAction = { label: string; url: string }

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

export const showNotification = ({
  title,
  message,
  action,
  params = notificationTypes.info,
  duration = 10000,
}: {
  title: string
  message: string | null
  params?: Params
  duration?: number
  action?: NotificationAction
}): void => {
  if (params === notificationTypes.danger) {
    consola.error('[Notification Error]', message)
  }

  duration = params.duration || duration

  const componentParams = {
    component: h(Notification, {
      title: title,
      message: message!,
      variant: params.variant,
      duration: duration,
      action: action,
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

export const infoMessage = (
  message,
  { url, duration }: { url?: string; duration?: number } = {},
) => {
  const { $i18n } = useNuxtApp()
  showNotification({
    title: 'Information',
    message,
    params: notificationTypes.info,
    action: url ? { label: $i18n.t('helper.learnMore'), url: '' } : undefined,
    duration,
  })
}

export const successMessage = (message) =>
  showNotification({
    title: 'Succes',
    message: `[SUCCESS] ${message}`,
    params: notificationTypes.success,
  })

export const getReportIssueAction = (message: string) => {
  const { $i18n } = useNuxtApp()
  return {
    label: $i18n.t('helper.reportIssue'),
    url: getGithubReportUrl(message),
  }
}

export const warningMessage = (message, { reportable = true } = {}) =>
  showNotification({
    title: 'Warning',
    message,
    params: notificationTypes.warn,
    action: reportable ? getReportIssueAction(message) : undefined,
  })
export const dangerMessage = (message) =>
  showNotification({
    title: 'Critical Error',
    message,
    params: notificationTypes.danger,
    action: getReportIssueAction(message),
  })
