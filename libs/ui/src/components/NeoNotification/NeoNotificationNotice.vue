<template>
  <NeoNotification v-bind="propsNotification" ref="notification" @close="close">
    <slot />
  </NeoNotification>
</template>

<script>
// extend https://github.com/oruga-ui/oruga/blob/ef46040e7cea02595afd198257d2eb5a4b49d11d/packages/oruga-next/src/components/notification/NotificationNotice.vue implementation
/* eslint-disable vue/require-default-prop */
import NeoNotification from './NeoNotification.vue'
import NoticeMixin from '@oruga-ui/oruga-next/src/utils/NoticeMixin'
import BaseComponentMixin from '@oruga-ui/oruga-next/src/utils/BaseComponentMixin'

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
    propsNotification: Object,
    noticeClass: [String, Function, Array],
    noticePositionClass: [String, Function, Array],
    noticeCustomContainerClass: [String, Function, Array],
  },
  emits: ['update:active', 'close'],
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
