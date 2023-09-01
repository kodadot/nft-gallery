import { NeoModalExtendProgrammatic } from '@kodadot1/brick'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('neoModal', () => NeoModalExtendProgrammatic)
})
