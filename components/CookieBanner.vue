<template>
  <CookieControl class="cookie-banner">
    <template #bar>
      <p>
        {{ $t('cookies.notice') }}
        <nuxt-link to="/cookie-notice" target="_blank" class="is-underlined"
          >Cookie Policy</nuxt-link
        >
        <span class="invisible md:visible mx-2">|</span>
      </p>
    </template>
  </CookieControl>
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
    if (!cookieConsentGiven.value) {
      window.location.reload()
    }
  },
  { deep: true },
)

onMounted(() => {
  if (cookieConsentGiven.value || cookieConsentGiven.value === undefined) {
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
  @apply invisible absolute top-3 right-0 h-0 w-0;
}
button.cookieControl__ModalClose:after {
  @apply absolute top-1 right-5 text-xs text-text-color font-medium bg-background-color hover:bg-gray-100 hover:text-gray-800 rounded-lg px-4 py-2.5 duration-300 transition-colors focus:outline-none visible;
  content: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22currentColor%22%20class%3D%22bi%20bi-x-lg%22%20viewBox%3D%220%200%2016%2016%22%3E%0A%20%20%3Cpath%20d%3D%22M2.146%202.854a.5.5%200%201%201%20.708-.708L8%207.293l5.146-5.147a.5.5%200%200%201%20.708.708L8.707%208l5.147%205.146a.5.5%200%200%201-.708.708L8%208.707l-5.146%205.147a.5.5%200%200%201-.708-.708L7.293%208z%22%2F%3E%0A%3C%2Fsvg%3E');
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
