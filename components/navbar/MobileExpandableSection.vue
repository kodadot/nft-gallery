<template>
  <div v-if="!isOpened" class="navbar-item" @click.stop="isOpened = !isOpened">
    <span>
      {{ title }}
      <NeoIcon v-if="icon" :icon="icon" :pack="iconFamily" />
    </span>
    <NeoIcon class="icon--right" icon="chevron-right" pack="fas" />
  </div>
  <div v-else class="navbar-item--fullpage">
    <div class="navbar-item navbar-item--reverse" @click.stop="close">
      <NeoIcon icon="chevron-left" pack="fas" />
      {{ title }}
    </div>
    <div :class="{ 'navbar-item': !noPadding }" class="navbar-item-body">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoIcon } from '@kodadot1/brick'

defineProps({
  title: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  iconFamily: {
    type: String,
    default: 'fas',
  },
  noPadding: {
    type: Boolean,
    default: false,
  },
})

const isOpened = ref(false)

const close = (): void => {
  isOpened.value = false
}
</script>
