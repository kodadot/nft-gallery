<template>
  <div v-if="!hasDisplayedCookieBanner" class="cookie-banner">
    <transition name="slide">
      <div class="notices is-bottom">
        <div
          role="alertdialog"
          class="snackbar is-success is-bottom-right py-2 px-4">
          <div class="">{{ $t('cookies.notice') }}</div>
          <div class="bar ml-4 mr-4" />
          <div class="action is-success">
            <a class="has-text-weight-bold" @click="acceptCookies">
              {{ $t('cookies.accept') }}
            </a>
            <a class="has-text-weight-bold ml-3" @click="declineCookies">
              {{ $t('cookies.decline') }}
            </a>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { useState } from 'vue-gtag-next'

const { isEnabled } = useState()
const hasDisplayedCookieBanner = ref(
  localStorage.getItem('cookies_enabled') !== null || false
)
const acceptCookies = () => {
  if (isEnabled) {
    isEnabled.value = true
  }
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
  }
}
</style>
