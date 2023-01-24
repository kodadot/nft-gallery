<template>
  <div v-if="!hasDisplayedCookieBanner">
    <transition name="slide">
      <div class="notices is-bottom">
        <div role="alertdialog" class="snackbar is-success is-bottom-right">
          <div class="text">{{ $t('cookies.notice') }}</div>
          <div class="action is-light is-cancel">
            <button class="button" @click="declineCookies">
              {{ $t('cookies.decline') }}
            </button>
          </div>
          <div class="action is-success">
            <button class="button" @click="acceptCookies">
              {{ $t('cookies.accept') }}
            </button>
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
