import {
  type NeoMessageIconVariant,
  type NeoMessageVariant,
  NeoNotificationProgrammatic as Notif,
} from '@kodadot1/brick'
import consola from 'consola'
import { h } from 'vue'
import Notification from '@/components/common/Notification.vue'

export type NotificationAction = { label: string, url: string, icon?: string }

export type NotificationFooter = MaybeRef<Omit<NotificationAction, 'url'> | undefined>

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
  variant,
  holdTimer,
  icon,
  footer,
  params = notificationTypes.info,
  duration = 10000,
}: {
  title?: MaybeRef<string>
  message?: MaybeRef<string> | null
  variant?: Ref<NeoMessageVariant>
  params?: Params
  duration?: number
  action?: MaybeRef<NotificationAction | undefined>
  holdTimer?: Ref<boolean>
  icon?: Ref<NeoMessageIconVariant | undefined>
  footer?: NotificationFooter
}) => {
  if (params === notificationTypes.danger) {
    consola.error('[Notification Error]', message)
  }

  duration = params.duration || duration

  const componentParams = {
    component: h(Notification, {
      title: title ? toRef(title) : title,
      message: message ? toRef(message!) : message,
      variant: variant ?? params.variant,
      duration: duration,
      action: action,
      holdTimer: holdTimer,
      icon: icon,
      footer: footer,
    }),
    variant: 'component',
    duration: 50000, // child component will trigger close when the real duration is ended
  }

  const notification = Notif.open(componentParams)

  return notification.close as () => void
}

export const infoMessage = (
  message,
  {
    url,
    duration,
    title = 'Information',
  }: { url?: string, duration?: number, title?: string } = {},
) => {
  const { $i18n } = useNuxtApp()
  showNotification({
    title,
    message,
    params: notificationTypes.info,
    action: url ? { label: $i18n.t('helper.learnMore'), url: '' } : undefined,
    duration,
  })
}

export const successMessage = (message: string, extraConfig?: { footer?: NotificationFooter }) =>
  showNotification({
    title: 'Success',
    message: message,
    params: notificationTypes.success,
    ...extraConfig,
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
export const dangerMessage = (
  message,
  {
    title = 'Critical Error',
    reportable = true,
  }: { title?: string, reportable?: boolean } = {},
) =>
  showNotification({
    title,
    message,
    params: notificationTypes.danger,
    action: reportable ? getReportIssueAction(message) : undefined,
  })

const ifIsRef = <T>(value: MaybeRef<T | undefined>, otherwise: T): T =>
  Boolean(value) && isRef(value) && unref(value)
    ? (value.value as T)
    : otherwise

const NotificationStateToVariantMap: Record<
  LoadingNotificationState,
  NeoMessageVariant
> = {
  succeeded: 'success',
  loading: 'neutral',
  failed: 'danger',
}

export type LoadingNotificationState = 'loading' | 'succeeded' | 'failed'

export type LoadingMessageParams = {
  title: MaybeRef<string>
  message?: MaybeRef<string | undefined>
  state: Ref<LoadingNotificationState>
  action?: Ref<NotificationAction | undefined>
  showIndexerDelayMessage?: boolean
}

export const loadingMessage = ({
  title,
  message,
  state,
  action,
  showIndexerDelayMessage: showIndexerDelayMesasge = false,
}: LoadingMessageParams) => {
  const { $i18n } = useNuxtApp()
  const stateMessage = ref(unref(message) ?? `${$i18n.t('mint.progress')}...`)

  watch(
    [state],
    ([state]) => {
      if (state === 'succeeded') {
        stateMessage.value = ifIsRef(
          message,
          $i18n.t('transactionLoader.completed'),
        )
      }
      else if (state === 'failed') {
        stateMessage.value = ifIsRef(message, '')
      }
    },
    {
      once: true,
    },
  )

  const isLoadingState = computed(() => state.value === 'loading')

  return showNotification({
    title,
    message: stateMessage,
    variant: computed(() => NotificationStateToVariantMap[state.value]),
    action: action,
    holdTimer: isLoadingState,
    icon: computed(() =>
      isLoadingState.value ? { icon: 'spinner-third', spin: true } : undefined,
    ),
    footer: computed(() =>
      state.value === 'succeeded' && showIndexerDelayMesasge ? { icon: 'circle-info', label: $i18n.t('general.updateOnWebsiteSoon') } : undefined,
    ),
  })
}
