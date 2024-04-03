<template>
  <transition name="slide">
    <div v-if="!hasDisplayedCookieBanner" class="cookie-banner">
      <div
        class="notices flex overflow-hidden pointer-events-none fixed p-[2em] inset-0 is-bottom items-center w-full z-[1000]">
        <div
          role="alertdialog"
          class="snackbar is-success is-bottom-left !py-4 md:!py-2 px-4 mb-3 flex-col md:flex-row">
          <div class="md:flex md:gap-1">
            {{ $t('cookies.notice') }}, see
            <nuxt-link to="/cookie-notice" target="_blank" class="is-underlined"
              >Cookie Policy</nuxt-link
            >
            for details.
          </div>
          <div
            class="bg-separator-line-color m-4 md:!my-0 !w-full !h-[1px] md:!w-[1px] md:!h-[13px]" />
          <div
            class="flex items-center justify-between md:!my-0 w-full md:w-fit">
            <NeoButton variant="text" no-shadow @click="declineCookies">
              {{ $t('cookies.decline') }}
            </NeoButton>
            <NeoButton
              variant="secondary-rounded"
              no-shadow
              class="ml-3 h-8"
              data-testid="cookie-banner-button-accept"
              @click="acceptCookies">
              {{ $t('cookies.accept') }}
            </NeoButton>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'
// import { useState } from 'vue-gtag-next'

// const { isEnabled } = useState()
const hasDisplayedCookieBanner = ref(
  localStorage.getItem('cookies_enabled') !== null || false,
)
const acceptCookies = () => {
  // if (isEnabled) {
  //   isEnabled.value = true
  // }
  localStorage.setItem('cookies_enabled', '1')
  hasDisplayedCookieBanner.value = true
}
const declineCookies = () => {
  localStorage.setItem('cookies_enabled', '0')
  hasDisplayedCookieBanner.value = true
}
</script>

<style lang="scss">
.cookie-banner {
  .snackbar {
    align-self: flex-start;
    max-width: 720px;
  }
}
</style>
