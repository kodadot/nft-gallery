// import Vue from 'vue'
// import VueTippy, { TippyComponent, tippy } from 'vue-tippy'

// let activeTippyInstance
// window.addEventListener('scroll', () => {
//   if (activeTippyInstance && activeTippyInstance.state.isVisible) {
//     activeTippyInstance.hide()
//     activeTippyInstance.reference.blur()
//   }
// })
// tippy.setDefaults({
//   onShow(instance) {
//     activeTippyInstance = instance
//   },
// })

// Vue.use(VueTippy)
// Vue.component('VTippy', TippyComponent)

import VueTippy from 'vue-tippy'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueTippy, {})
})
