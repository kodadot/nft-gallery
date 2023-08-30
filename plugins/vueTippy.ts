import VueTippy, { TippyComponent, tippy } from 'vue-tippy'

let activeTippyInstance
window.addEventListener('scroll', () => {
  if (activeTippyInstance && activeTippyInstance.state.isVisible) {
    activeTippyInstance.hide()
    activeTippyInstance.reference.blur()
  }
})

tippy.setDefaults({
  onShow(instance) {
    activeTippyInstance = instance
  },
})

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueTippy, {
    directive: 'tippy',
    component: 'v-tippy',
    defaultProps: {
      placement: 'auto-end',
      allowHTML: true,
    },
  })
  nuxtApp.vueApp.component('VTippy', TippyComponent)
})
