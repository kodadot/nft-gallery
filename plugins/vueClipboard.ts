export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('clipboard', {
    beforeMount(el, { value, arg }) {
      const clickEventHandler = () => {
        if (arg === 'copy') {
          copyToClipboard(value, { toast: false, toastMessage: '' })
        }
      }
      el.addEventListener('click', clickEventHandler)

      el._cleanup = () => el.removeEventListener('click', clickEventHandler)
    },
    updated(el, { value, arg }) {
      el.dataset._clipboard_value = value
      el.dataset._clipboard_arg = arg
    },
    unmounted(el) {
      if (el._cleanup) {
        el._cleanup()
      }
    },
  })
})
