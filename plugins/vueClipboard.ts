export default defineNuxtPlugin((nuxtApp) => {
  const { text, copy, copied, isSupported } = useClipboard({ legacy: true })

  nuxtApp.vueApp.directive('clipboard', {
    beforeMount(el, { value, arg }) {
      el.dataset._clipboard_value = value
      useEventListener(el, 'click', () => {
        switch (arg) {
          case 'copy':
            copy(el.dataset._clipboard_value)
            break
        }
      })
    },
    updated(el, { value, arg }) {
      switch (arg) {
        case 'copy':
          el.dataset._clipboard_value = value
          break
      }
    },
  })

  return {
    provide: {
      clipboard: {
        text,
        copy,
        copied,
        isSupported,
      },
    },
  }
})
