import VueTippy, { setDefaultProps } from 'vue-tippy'
import 'tippy.js/animations/shift-away.css'

let activeTippyInstance
useEventListener('scroll', () => {
  if (activeTippyInstance && activeTippyInstance.state.isVisible) {
    activeTippyInstance.hide()
    activeTippyInstance.reference.blur()
  }
})

setDefaultProps({
  onShow(instance) {
    activeTippyInstance = instance
  },
})

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueTippy, {
    defaultProps: {
      interactive: true,
      animateFill: false,
      animation: 'shift-away',
      placement: 'bottom',
    },
  })
})
