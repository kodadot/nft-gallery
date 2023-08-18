import Vue from 'vue'
import NotificationNotice from './NeoNotificationNotice.vue'

import { getOptions } from '@oruga-ui/oruga/src/utils/config'
import { getValueByPath, merge } from '@oruga-ui/oruga/src/utils/helpers'
import InstanceRegistry from '@oruga-ui/oruga/src/utils/InstanceRegistry'

let instances = new InstanceRegistry()

const NotificationProgrammatic = {
  open(params) {
    let parent
    if (typeof params === 'string') {
      params = {
        message: params,
      }
    }

    const defaultParam = {
      programmatic: { instances },
      position: getValueByPath(
        getOptions(),
        'notification.position',
        'top-right'
      ),
      closable:
        params.closable ||
        getValueByPath(getOptions(), 'notification.closable', false),
    }
    if (params.parent) {
      parent = params.parent
      delete params.parent
    }
    let slot
    if (Array.isArray(params.message)) {
      slot = params.message
      delete params.message
    }
    // fix animation
    params.active = false
    const propsData = merge(defaultParam, params)
    if (window.Promise) {
      propsData.promise = new Promise((p1, p2) => {
        propsData.programmatic.resolve = p1
        propsData.programmatic.reject = p2
      })
    }

    const NotificationNoticeComponent = Vue.extend(NotificationNotice)
    const component = new NotificationNoticeComponent({
      parent,
      el: document.createElement('div'),
      propsData,
    })
    if (slot) {
      component.$slots.default = slot
      component.$forceUpdate()
    }
    // fix animation
    component.$children[0].isActive = true
    return component
  },
  closeAll() {
    instances.walk((entry) => {
      entry.close(...arguments)
    })
  },
}

export default NotificationProgrammatic
