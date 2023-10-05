import NotificationNotice from './NeoNotificationNotice.vue'

import { getOptions } from '@oruga-ui/oruga-next/src/utils/config'
import { getValueByPath, merge } from '@oruga-ui/oruga-next/src/utils/helpers'
import InstanceRegistry from '@oruga-ui/oruga-next/src/utils/InstanceRegistry'

import { createVNode, render } from 'vue'

const instances = new InstanceRegistry()

const NotificationProgrammatic = {
  open(params): InstanceType<typeof NotificationNotice> {
    // vue context from nuxtApp()
    const { vueApp } = useNuxtApp()

    let newParams
    if (typeof params === 'string') {
      newParams = {
        message: params,
      }
    } else {
      newParams = params
    }

    const defaultParam = {
      programmatic: { instances },
      position: getValueByPath(
        getOptions(),
        'notification.position',
        'top-right',
      ),
      closable:
        params.closable ||
        getValueByPath(getOptions(), 'notification.closable', false),
      iconPack: 'fasr',
    }
    let slot
    if (Array.isArray(newParams.message)) {
      slot = newParams.message
      delete newParams.message
    }

    newParams.active = true
    const propsData = merge(defaultParam, newParams)
    propsData.promise = new Promise((p1, p2) => {
      propsData.programmatic.resolve = p1
      propsData.programmatic.reject = p2
    })

    const app = vueApp
    propsData.propsNotification = Object.assign({}, propsData)
    propsData.propsNotification.isActive = true
    const defaultSlot = () => {
      return slot
    }
    const vnode = createVNode(NotificationNotice, propsData, defaultSlot)
    vnode.appContext = app._context
    render(vnode, document.createElement('div'))
    return vnode.component?.proxy as InstanceType<typeof NotificationNotice>
  },
  closeAll() {
    instances.walk((entry) => {
      // eslint-disable-next-line prefer-rest-params
      entry.close(...arguments)
    })
  },
}

export default NotificationProgrammatic
