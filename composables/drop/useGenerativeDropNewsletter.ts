import newsletterApi from '@/utils/newsletter'
import { DEFAULT_NEWSLETTER_SUBSCRIPTION } from '@/stores/preferences'

export default () => {
  const { toast } = useToast()
  const { $i18n } = useNuxtApp()

  const preferencesStore = usePreferencesStore()

  const checkingSubscription = ref(false)
  const subscribingToNewsletter = ref(false)
  const resendingConfirmationEmail = ref(false)
  const sendConfirmationEmailOnModalOpen = ref(false)

  const emailConfirmed = computed<boolean>(
    () => preferencesStore.getNewsletterSubscription.confirmed,
  )
  const subscriptionId = computed(
    () => preferencesStore.getNewsletterSubscription.id,
  )

  const checkSubscription = async (subscriptionId: string) => {
    try {
      checkingSubscription.value = true
      const response = await newsletterApi.getSubscription(subscriptionId)

      const subscriptionConfirmed = response.status === 'active'

      if (subscriptionConfirmed) {
        preferencesStore.setNewsletterSubscription({
          subscribed: true,
          confirmed: true,
          email: response.email,
          id: response.id,
        })
      }
    } catch (error) {
      toast($i18n.t('drops.failedCheckingSubscription'))
    } finally {
      checkingSubscription.value = false
    }
  }

  const resendConfirmationEmail = async (subscriptionId: string) => {
    try {
      resendingConfirmationEmail.value = true
      const data = await newsletterApi.resendConfirmationEmail(subscriptionId)
      preferencesStore.setNewsletterSubscription({
        ...preferencesStore.getNewsletterSubscription,
        id: data.id,
      })
      toast($i18n.t('drops.emailConfirmationSent'))
    } catch (error) {
      toast($i18n.t('drops.failedEmailConfirmation'))
    } finally {
      resendingConfirmationEmail.value = false
    }
  }

  const subscribe = async (email: string) => {
    try {
      subscribingToNewsletter.value = true
      const response = await newsletterApi.subscribe(email)
      preferencesStore.setNewsletterSubscription({
        email,
        subscribed: true,
        confirmed: false,
        id: response.id,
      })
    } catch (error) {
      dangerMessage($i18n.t('signupBanner.failed'))
      preferencesStore.setNewsletterSubscription(
        DEFAULT_NEWSLETTER_SUBSCRIPTION,
      )
      throw error
    } finally {
      subscribingToNewsletter.value = false
    }
  }

  onMounted(async () => {
    if (!emailConfirmed.value && subscriptionId.value) {
      await checkSubscription(subscriptionId.value)
      sendConfirmationEmailOnModalOpen.value = !emailConfirmed.value
    }
  })

  return {
    checkSubscription,
    subscribe,
    resendConfirmationEmail,

    checkingSubscription,
    subscribingToNewsletter,
    resendingConfirmationEmail,
    sendConfirmationEmailOnModalOpen,

    emailConfirmed,
    subscriptionId,
  }
}
