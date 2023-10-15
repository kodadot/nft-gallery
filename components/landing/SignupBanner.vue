<template>
  <div class="columns is-multiline">
    <div class="column is-8-desktop is-6-tablet is-12-mobile">
      <div class="columns is-multiline">
        <div
          class="column is-6-desktop is-12-tablet is-12-mobile is-flex is-align-items-center">
          <h3 class="is-size-5 has-text-weight-bold">
            {{ $t('signupBanner.title') }}
          </h3>
          <div
            class="ml-4 is-relative signup-voucher is-flex is-align-items-center">
            <img :src="logoSrc" alt="signup voucher" />
            <img
              src="/signup-voucher-blur.svg"
              alt="signup voucher blur"
              class="blur" />
          </div>
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

const { $i18n } = useNuxtApp()
const preferencesStore = usePreferencesStore()
const { isDarkMode } = useTheme()

const logoSrc = computed(() =>
  isDarkMode.value ? '/signup-voucher-dark.svg' : '/signup-voucher.svg',
)

const email = ref()
const loading = ref(false)

const submit = async () => {
  try {
    loading.value = true
    await newsletterApi.subscribe(email.value)
    preferencesStore.setSubscribedToNewsletter(true)
    successMessage($i18n.t('signupBanner.subscribed'))
  } catch (error) {
    dangerMessage($i18n.t('signupBanner.failed'))
  } finally {
    loading.value = false
  }
}
</script>
<styles lang="scss" scoped>
.fixed-height {
  height: 2.5rem !important;
}

.signup-voucher {
  .blur {
    transform: scale(2.5);
    top: 0;
    left: 0;
    position: absolute;
    z-index: -1;
  }
}
</styles>
