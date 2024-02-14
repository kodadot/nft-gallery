<template>
  <transition name="slide">
    <CookieControl class="cookie-banner">
      <template #bar>
        <h2>
          {{ $t('cookies.notice') }}, see
          <nuxt-link to="/cookie-notice" target="_blank" class="is-underlined"
            >Cookie Policy</nuxt-link
          >
          for details. <span class="mx-2">|</span>
        </h2>
      </template>
    </CookieControl>
    <!-- <div v-if="!hasDisplayedCookieBanner" class="cookie-banner">
      <div
        class="notices flex overflow-hidden pointer-events-none fixed p-[2em] inset-0 is-bottom items-center w-full z-[1000]">
        <div
          role="alertdialog"
          class="snackbar is-success is-bottom-left py-2 px-4 mb-3">
          <div>
            {{ $t('cookies.notice') }}, see
            <nuxt-link to="/cookie-notice" target="_blank" class="is-underlined"
              >Cookie Policy</nuxt-link
            >
            for details.
          </div>
          <div class="bar ml-4 mr-4" />
          <div class="action is-success">
            <NeoButton variant="text" no-shadow @click="declineCookies">
              {{ $t('cookies.decline') }}
            </NeoButton>
            <NeoButton
              variant="text"
              no-shadow
              class="font-bold ml-3"
              data-testid="cookie-banner-button-accept"
              @click="acceptCookies">
              {{ $t('cookies.accept') }}
            </NeoButton>
          </div>
        </div>
      </div>
    </div> -->
  </transition>
</template>

<script lang="ts" setup>
// import { NeoButton } from '@kodadot1/brick'

// const cookieControl = useCookieControl()

// import { useState } from 'vue-gtag-next'

// const { isEnabled } = useState()
// const hasDisplayedCookieBanner = ref(
//   localStorage.getItem('cookies_enabled') !== null || false,
// )
// const acceptCookies = () => {
//   // if (isEnabled) {
//   //   isEnabled.value = true
//   // }
//   localStorage.setItem('cookies_enabled', '1')
//   hasDisplayedCookieBanner.value = true
// }
// const declineCookies = () => {
//   localStorage.setItem('cookies_enabled', '0')
//   hasDisplayedCookieBanner.value = true
// }
</script>

<style lang="scss">
/* Custom Cookie #Bar */
.cookieControl__BarContainer {
  @apply fixed p-4 mx-auto max-w-3xl self-start left-6 bottom-5 text-text-color bg-background-color border border-border-color shadow-primary;
}
.cookieControl__BarContainer h2 {
  @apply text-text-color text-base;
}
.cookieControl__BarButtons button {
  @apply text-sm bg-inherit text-text-color px-2 py-1;
}

/* Custom Cookie #Modal */
.cookieControl__ModalContent {
  @apply text-text-color bg-background-color border border-border-color shadow-primary items-center;
}
.cookieControl__ModalContent :not(button) {
  @apply text-text-color;
}
button.cookieControl__ModalClose {
  @apply invisible absolute top-3 right-0 h-0 w-0;
}
button.cookieControl__ModalClose:after {
  @apply absolute top-1 right-5 text-xs text-gray-800 font-medium bg-white hover:bg-gray-100 hover:text-gray-800 rounded-lg px-4 py-2.5 duration-300 transition-colors focus:outline-none visible;
  content: 'X';
}
.cookieControl__ModalButtons {
  @apply grid grid-cols-3 gap-4 mt-4 shrink-0 w-full;
}
.cookieControl__ModalButtons button {
  @apply text-sm bg-inherit text-text-color px-1 py-2;
}
.cookieControl__ModalContent .cookieControl__ModalInputWrapper input + button {
  @apply bg-gray-400;
}
.cookieControl__ModalContent
  .cookieControl__ModalInputWrapper
  input:checked
  + button {
  @apply border border-solid border-border-color bg-background-color;
}
.cookieControl__ModalContent
  .cookieControl__ModalInputWrapper
  input:disabled
  + button {
  @apply bg-gray-300;
}

.cookie-banner {
  .snackbar {
    align-self: flex-start;
    height: 2.188rem;
    max-width: 720px;

    @media screen and (max-width: 768px) {
      height: auto;
      width: 11.875rem;
      flex-direction: column;
      display: flex;
      align-self: auto !important;

      .action {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 100%;
      }

      .bar {
        height: 1px;
        width: 100%;
        margin-top: 11px;
      }
    }
  }
}
</style>
