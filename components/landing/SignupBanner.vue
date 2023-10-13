<template>
  <div class="columns is-multiline">
    <div class="column is-8-desktop is-6-tablet is-12-mobile">
      <div class="columns is-multiline">
        <div
          class="column is-6-desktop is-12-tablet is-12-mobile is-flex is-align-items-center">
          <h3 class="is-size-4 has-text-weight-bold">
            {{ $t('signupBanner.title') }}
          </h3>
          <img src="/signup-voucher.svg" alt="signup voucher" />
        </div>

        <div
          class="column is-6-desktop is-12-tablet is-12-mobile is-flex is-align-items-center">
          <span>
            {{ $t('signupBanner.subtitle') }}
          </span>
        </div>
      </div>
    </div>

    <div
      class="column is-4-desktop is-6-tablet is-12-mobile is-flex is-align-items-center">
      <form class="is-flex is-align-items-center" @submit.prevent="submit">
        <NeoInput
          v-model="email"
          type="email"
          class="fixed-height"
          placeholder="jane.doe@kodadot.xyz"
          required />

        <NeoButton
          class="ml-4 fixed-height"
          native-type="submit"
          variant="k-accent"
          :loading="loading"
          :disabled="loading"
          no-shadow>
          {{ $t('signupBanner.claimVoucher') }}
        </NeoButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoInput } from '@kodadot1/brick'
import newsletterApi from '@/utils/newsletter'
import { usePreferencesStore } from '@/stores/preferences'

const { toast } = useToast()
const { $i18n } = useNuxtApp()
const preferencesStore = usePreferencesStore()

const email = ref()
const loading = ref(false)

const submit = async () => {
  try {
    loading.value = true
    await newsletterApi.subscribe(email.value)
    preferencesStore.setSubscribedToNewsletter(true)
    toast($i18n.t('signupBanner.subscribed'))
  } finally {
    loading.value = false
  }
}
</script>
<styles lang="scss" scoped>
.fixed-height {
  height: 2.5rem !important;
}
</styles>
