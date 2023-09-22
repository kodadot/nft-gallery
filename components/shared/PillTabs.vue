<template>
  <div class="is-flex mb-2 pill-tabs-container">
    <div
      v-for="tab in tabs"
      :key="tab.value"
      class="tab py-2 px-4 is-flex is-align-items-center is-clickable"
      :class="{
        tab__active: tab.active,
      }"
      @click="() => handleTabClick(tab.value)">
      <img
        v-if="tab.image"
        class="mr-2 image square-20"
        :src="tab.image"
        alt="tab" />

      <NeoIcon
        v-else-if="tab.icon"
        class="mr-2"
        :icon="tab.icon.name"
        :pack="tab.icon.pack" />

      <span>{{ tab.label }}</span>

      <NeoIcon
        v-if="tab.ticked"
        class="ml-2 has-text-k-green"
        icon="fa-check"
        pack="fa-solid" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoIcon } from '@kodadot1/brick'

export type Icon = {
  name: string
  pack: string
}

export type PillTab = {
  label: string
  value: string
  icon?: Icon
  image?: string
  active?: boolean
  ticked?: boolean
}

defineProps<{
  tabs: PillTab[]
}>()

const emit = defineEmits(['select'])

const handleTabClick = (value: string) => {
  emit('select', value)
}
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.square-20 {
  width: 20px;
  height: 20px;
}

.pill-tabs-container {
  gap: 10px;

  @media screen and (max-width: 1216px) {
    flex-wrap: wrap !important;
  }

  .tab {
    border-radius: 3rem;

    @include ktheme() {
      background-color: theme('background-color');
      color: theme('text-color');
      border: 1px solid theme('card-border-color');

      &:hover {
        border: 1px solid theme('border-color');
      }
    }

    &__active {
      @include ktheme() {
        background-color: theme('background-color-inverse');
        color: theme('text-color-inverse');
        border: 1px solid theme('background-color-inverse');
      }
    }
  }
}
</style>
