<template>
  <div v-if="!hasDisplayedCookieBanner" class="cookie-banner">
    <transition name="slide">
      <div class="notices is-bottom is-flex w-100 is-align-items-center">
        <div
          role="alertdialog"
          class="snackbar is-success is-bottom-left py-2 px-4 mb-3">
          <div>
            <div class="">{{ $t('cookies.notice') }}</div>
          </div>
          <div class="bar ml-4 mr-4" />
          <div class="action is-success">
            <a @click="declineCookies">
              {{ $t('cookies.decline') }}
            </a>
            <a class="has-text-weight-bold ml-3" @click="acceptCookies">
              {{ $t('cookies.accept') }}
            </a>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
// import { useState } from 'vue-gtag-next'

// const { isEnabled } = useState()
const hasDisplayedCookieBanner = ref(
  localStorage.getItem('cookies_enabled') !== null || false
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
    height: 2.188rem;

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
