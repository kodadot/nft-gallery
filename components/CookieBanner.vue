<template>
  <transition name="slide">
    <CookieControl class="cookie-banner">
      <template #bar>
        <p>
          {{ $t('cookies.notice') }}, see
          <nuxt-link to="/cookie-notice" target="_blank" class="is-underlined"
            >Cookie Policy</nuxt-link
          >
          for details. <span class="invisible md:visible mx-2">|</span>
        </p>
      </template>
    </CookieControl>
  </transition>
</template>

<script lang="ts" setup>
const cookieControl = useCookieControl()
const { grantConsent, revokeConsent } = useGtag()

const cookieConsentGiven = computed(() =>
  cookieControl.cookiesEnabledIds.value?.includes('ga'),
)

watch(
  () => cookieControl.cookiesEnabledIds.value,
  () => {
    window.location.reload()
  },
  { deep: true },
)

onMounted(() => {
  if (cookieConsentGiven.value) {
    grantConsent()
  } else {
    revokeConsent()
  }
})
</script>

<style lang="scss">
/* Custom Cookie #Bar */
.cookieControl__BarContainer {
  @apply fixed p-4 mx-auto max-w-3xl self-start left-6 bottom-5 text-text-color bg-background-color border border-border-color shadow-primary;
}
.cookieControl__BarContainer p {
  @apply text-text-color text-base;
}
.cookieControl__BarButtons button {
  @apply text-sm bg-inherit text-text-color px-2 py-1;
}

/* Custom Cookie #Modal */
.cookieControl__ModalContent {
  @apply text-text-color bg-background-color border border-border-color shadow-primary items-center overflow-y-clip;
}
.cookieControl__ModalContent :not(button) {
  @apply text-text-color;
}
button.cookieControl__ModalClose {
  font-family: 'Font Awesome 6 Sharp';
  @apply invisible absolute top-3 right-0 h-0 w-0;
}
button.cookieControl__ModalClose:after {
  @apply absolute top-1 right-5 text-xs text-text-color font-medium bg-background-color hover:bg-gray-100 hover:text-gray-800 rounded-lg px-4 py-2.5 duration-300 transition-colors focus:outline-none visible;
  content: '\f00d';
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
.cookieControl__ModalContent input:checked + button::before {
  @apply bg-text-color;
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
@media screen and (max-width: 768px) {
  .cookieControl__BarButtons button + button {
    margin: 0;
  }
  .cookieControl__BarButtons {
    flex-direction: row-reverse;
  }
  .cookieControl__BarContainer {
    right: 1.5rem;
  }
}
</style>
