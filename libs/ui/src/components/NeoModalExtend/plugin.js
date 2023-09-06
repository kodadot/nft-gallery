import Vue from 'vue'
import Modal from './NeoModalExtend.vue'

import { merge } from '@oruga-ui/oruga/src/utils/helpers'
import InstanceRegistry from '@oruga-ui/oruga/src/utils/InstanceRegistry'

let instances = new InstanceRegistry()
let openListener = []
// fork https://github.com/oruga-ui/oruga/blob/4915c4dbcb1a6c2cd39bc7660d41916b330bc0cd/packages/oruga/src/components/modal/index.js#L12 implementation
const ModalProgrammatic = {
  addOpenListener(callback) {
    openListener.push(callback)
  },
  removeOpenListener(callback) {
    openListener = openListener.filter((e) => e !== callback)
  },
  open(params) {
    let parent
    if (typeof params === 'string') {
      params = {
        content: params,
      }
    }

    const defaultParam = {
      programmatic: { instances },
      scroll: 'clip',
    }
    if (params.parent) {
      parent = params.parent
      delete params.parent
    }
    let slot
    if (Array.isArray(params.content)) {
      slot = params.content
      delete params.content
    }
    const propsData = merge(defaultParam, params)

    if (window.Promise) {
      propsData.promise = new Promise((p1, p2) => {
        propsData.programmatic.resolve = p1
        propsData.programmatic.reject = p2
      })
    }

    const ModalComponent = Vue.extend(Modal)
    const instance = new ModalComponent({
      parent,
      el: document.createElement('div'),
      propsData,
    })
    if (slot) {
      instance.$slots.default = slot
    }
    for (let callback of openListener) {
      callback.call(null)
    }
    return instance
  },
  closeAll() {
    instances.walk((entry) => {
      entry.close(...arguments)
    })
  },
}

export default ModalProgrammatic
