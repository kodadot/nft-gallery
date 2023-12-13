export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('clipboard', {
    beforeMount(el, binding) {
      el._clipboardValue = binding.value

      const clickEventHandler = () => {
        if (binding.arg === 'copy') {
          console.log('copy', el._clipboardValue)
          copyToClipboard(el._clipboardValue, { toast: false })
        }
      }
      el.addEventListener('click', clickEventHandler)
      el._clickEventHandler = clickEventHandler
    },
    updated(el, binding) {
      el._clipboardValue = binding.value
    },
    unmounted(el) {
      if (el._clickEventHandler) {
        el.removeEventListener('click', el._clickEventHandler)
      }
    },
  })
})
