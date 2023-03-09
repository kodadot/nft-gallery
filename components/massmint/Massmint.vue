<template>
  <NeoButton
    :label="'to onboarding'"
    icon="arrow-right"
    icon-pack="fas"
    @click.native="toOnborading" />
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { useMassmintsStore } from '@/stores/massmint'
const massMintStore = useMassmintsStore()
const { $consola } = useNuxtApp()
const router = useRouter()
const { urlPrefix } = usePrefix()

const toOnborading = () => {
  massMintStore.setVisitedOnboarding(false)
  router
    .replace({
      path: `/${urlPrefix.value}/massmint/onboarding`,
    })
    .catch($consola.warn)
}
</script>
