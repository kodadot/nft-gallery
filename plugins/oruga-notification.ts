import { NeoNotificationProgrammatic } from '@kodadot1/brick'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('neoNotification', () => NeoNotificationProgrammatic)
})
