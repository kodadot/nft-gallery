<template>
  <NeoButton
    :label="'to onboarding'"
    icon="arrow-right"
    icon-pack="fas"
    @click.native="toOnborading" />
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { usePreferencesStore } from '@/stores/preferences'
const preferencesStore = usePreferencesStore()
const { $consola } = useNuxtApp()
const router = useRouter()
const { urlPrefix } = usePrefix()

const toOnborading = () => {
  preferencesStore.setVisitedOnboarding(false)
  router
    .replace({
      path: `/${urlPrefix.value}/massmint/onboarding`,
    })
    .catch($consola.warn)
}
</script>
