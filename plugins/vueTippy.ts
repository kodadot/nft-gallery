import Vue from 'vue'
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

Vue.use(VueTippy)
Vue.component('v-tippy', TippyComponent)
