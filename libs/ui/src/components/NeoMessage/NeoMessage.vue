<template>
  <transition name="fade">
    <article v-show="isActive" class="message" :class="[type, size]">
      <header v-if="$slots.header || title" class="message-header">
        <div v-if="$slots.header">
          <slot name="header" />
        </div>
        <p v-else-if="title">{{ title }}</p>
        <NeoButton
          v-if="closable"
          type="button"
          class="delete"
          @click="close" />
      </header>
      <section v-if="$slots.default" class="message-body">
        <div class="media">
          <div v-if="computedIcon && hasIcon" class="media-left">
            <NeoIcon :icon="computedIcon" :pack="iconPack" :class="type" both />
          </div>
          <div class="media-content">
            <slot />
          </div>
        </div>
      </section>
    </article>
  </transition>
</template>

<script lang="ts">
import NeoButton from '../NeoButton/NeoButton.vue'
import NeoIcon from '../NeoIcon/NeoIcon.vue'

export default {
  name: 'NeoMessage',
  components: {
    NeoButton,
    NeoIcon,
  },
  props: {
    active: {
      type: Boolean,
      default: true,
    },
    title: String,
    closable: {
      type: Boolean,
      default: true,
    },
    message: String,
    type: String,
    hasIcon: Boolean,
    size: String,
    icon: String,
    iconPack: String,
    iconSize: String,
    autoClose: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: Number,
      default: 2000,
    },
  },
  data() {
    return {
      isActive: this.active,
      remainingTime: this.duration / 1000, // in seconds
    }
  },
  computed: {
    computedIcon() {
      if (this.icon) {
        return this.icon
      }
      switch (this.type) {
        case 'is-info':
          return 'information'
        case 'is-success':
          return 'check-circle'
        case 'is-warning':
          return 'alert'
        case 'is-danger':
          return 'alert-circle'
        default:
          return null
      }
    },
  },
  watch: {
    active(value) {
      this.isActive = value
    },
    isActive(value) {
      if (value) {
        this.setAutoClose()
      } else {
        if (this.timer) {
          clearTimeout(this.timer)
        }
      }
    },
  },
  mounted() {
    this.setAutoClose()
  },
  methods: {
    /**
     * Close the Message and emit events.
     */
    close() {
      this.isActive = false
      this.resetDurationProgress()
      this.$emit('close')
      this.$emit('update:active', false)
    },
    click() {
      this.$emit('click')
    },
    /**
     * Set timer to auto close message
     */
    setAutoClose() {
      if (this.autoClose) {
        this.timer = setTimeout(() => {
          if (this.isActive) {
            this.close()
          }
        }, this.duration)
      }
    },
    resetDurationProgress() {
      /**
       * Wait until the component get closed and then reset
       **/
      setTimeout(() => {
        this.remainingTime = this.duration / 1000
      }, 100)
    },
  },
}
</script>

<style scoped lang="scss">
@import './NeoMessage.scss';
</style>
