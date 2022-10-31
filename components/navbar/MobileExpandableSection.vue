<template>
  <div v-if="!isOpened" class="navbar-item" @click.stop="isOpened = !isOpened">
    <span>
      {{ title }}
      <b-icon v-if="icon" :icon="icon" :pack="iconFamily" />
    </span>
    <b-icon class="icon--right" icon="chevron-right" pack="fas" />
  </div>
  <div v-else class="navbar-item--fullpage">
    <div class="navbar-item navbar-item--reverse" @click.stop="close">
      <b-icon icon="chevron-left" pack="fas" />
      {{ title }}
    </div>
    <div :class="{ 'navbar-item': !noPadding }" class="navbar-item-body">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: String,
  icon: String,
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

const close = () => {
  isOpened.value = false
}
</script>
