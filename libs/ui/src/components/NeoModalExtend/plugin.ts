import { createVNode, render } from 'vue'
import Modal from './NeoModalExtend.vue'

import { merge } from '@oruga-ui/oruga-next/src/utils/helpers'
import InstanceRegistry from '@oruga-ui/oruga-next/src/utils/InstanceRegistry'

const instances = new InstanceRegistry()

const ModalProgrammatic = {
  open(params): InstanceType<typeof Modal> {
    // vue context from nuxtApp()
    const { vueApp } = useNuxtApp()

    let newParams
    if (typeof params === 'string') {
      newParams = {
        content: params,
      }
    } else {
      newParams = params
    }

    const defaultParam = {
      programmatic: { instances },
      scroll: 'clip',
    }
    let slot
    if (Array.isArray(newParams.content)) {
      slot = newParams.content
      delete newParams.content
    }
    const propsData = merge(defaultParam, newParams)
    propsData.promise = new Promise((p1, p2) => {
      propsData.programmatic.resolve = p1
      propsData.programmatic.reject = p2
    })

    const app = vueApp
    const defaultSlot = () => {
      return slot
    }
    const vnode = createVNode(Modal, propsData, defaultSlot)
    vnode.appContext = app._context
    render(vnode, document.createElement('div'))
    return vnode.component?.proxy as InstanceType<typeof Modal>
  },
  closeAll() {
    instances.walk((entry) => {
      // eslint-disable-next-line prefer-rest-params
      entry.close(...arguments)
    })
  },
}

export default ModalProgrammatic
