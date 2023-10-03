<template>
  <NeoNotification
    v-bind="$options.propsData"
    ref="notification"
    @close="close">
    <slot />
  </NeoNotification>
</template>

<script>
// extend https://github.com/oruga-ui/oruga/blob/4915c4dbcb1a6c2cd39bc7660d41916b330bc0cd/packages/oruga/src/components/notification/NotificationNotice.vue#L18C12-L18C31 implementation
/* eslint-disable vue/require-default-prop */
import NeoNotification from './NeoNotification.vue'
import NoticeMixin from '@oruga-ui/oruga/src/utils/NoticeMixin'
import BaseComponentMixin from '@oruga-ui/oruga/src/utils/BaseComponentMixin'

/**
 * @displayName Notification Notice
 */
export default {
  name: 'NeoNotificationNotice',
  configField: 'notification',
  components: {
    NeoNotification,
  },
  mixins: [BaseComponentMixin, NoticeMixin],
  props: {
    noticeClass: [String, Function, Array],
    noticePositionClass: [String, Function, Array],
    noticeCustomContainerClass: [String, Function, Array],
  },
  methods: {
    rootClasses() {
      return [this.computedClass('noticeClass', 'o-notices')]
    },
    positionClasses(position) {
      return [
        this.computedClass('noticePositionClass', 'o-notices--', position),
      ]
    },
    noticeCustomContainerClasses() {
      return [
        this.computedClass(
          'noticeCustomContainerClass',
          'o-notices__custom-container'
        ),
      ]
    },
    timeoutCallback() {
      return this.$refs.notification.close({
        action: 'close',
        method: 'timeout',
      })
    },
  },
}
</script>
