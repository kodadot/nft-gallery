export default defineNuxtPlugin((nuxtApp) => {
  const { text, copy, copied, isSupported } = useClipboard({ legacy: true })

  nuxtApp.vueApp.directive('clipboard', {
    beforeMount(el, { value, arg }) {
      useEventListener(el, 'click', () => {
        switch (arg) {
          case 'copy':
            copy(value)
            break
        }
      })
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
