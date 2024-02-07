<template>
  <div class="signup-banner">
    <div class="signup-banner__left">
      <div class="signup-banner__title-container">
        <h3 class="text-xl font-bold">
          {{ $t('signupBanner.title') }}
        </h3>

        <div class="ml-4 relative signup-banner-voucher flex-shrink-0">
          <img :src="signUpVoucherIcon" alt="signup voucher" />
          <img
            src="/signup-voucher-blur.svg"
            alt="signup voucher blur"
            class="blur" />
        </div>
      </div>

      <span class="signup-banner__subtitle-container">
        {{ $t('signupBanner.subtitle') }}
      </span>
    </div>

    <form class="signup-banner__form-container" @submit.prevent="submit">
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
</template>

<script setup lang="ts">
import { NeoButton, NeoInput } from '@kodadot1/brick'
import newsletterApi from '@/utils/newsletter'
import { usePreferencesStore } from '@/stores/preferences'

const { $i18n } = useNuxtApp()
const preferencesStore = usePreferencesStore()

const { signUpVoucherIcon } = useIcon()

const email = ref()
const loading = ref(false)

const submit = async () => {
  try {
    loading.value = true
    const response = await newsletterApi.subscribe(email.value)
    preferencesStore.setNewsletterSubscription({
      email: email.value,
      subscribed: true,
      confirmed: false,
      id: response.id,
    })
    successMessage($i18n.t('signupBanner.subscribed'))
  } catch (error) {
    dangerMessage($i18n.t('signupBanner.failed'))
  } finally {
    loading.value = false
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/abstracts/variables';

$column-gap: 20px;

.signup-banner {
  display: grid;
  grid-template-columns: 2fr auto;
  grid-gap: $column-gap;

  .fixed-height {
    height: 2.25rem;
  }
  @include mobile {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(2, auto);
  }

  &__left {
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: $column-gap;

    @include touch {
      grid-template-columns: 1fr;
      grid-template-rows: repeat(2, auto);
    }
  }

  &__title-container {
    display: flex;
    align-items: center;
  }

  &__subtitle-container {
    display: inline-flex;
    align-items: center;

    @include touch {
      align-items: start;
    }
  }

  &__form-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .neo-input {
      width: 100%;
    }

    @include tablet-only {
      align-items: flex-start;
    }

    @include mobile {
      justify-content: flex-start;
    }
  }

  &-voucher {
    display: flex;
    align-items: center;
    .blur {
      @apply absolute scale-[2] left-0 top-0 -z-[1];
    }
  }
}
</style>
