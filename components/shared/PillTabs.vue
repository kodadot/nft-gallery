<template>
  <div class="flex mb-2 pill-tabs-container">
    <NeoButton
      v-for="tab in tabs"
      :key="tab.value"
      :active="tab.active"
      variant="pill"
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
        class="ml-2 text-k-green"
        icon="fa-check"
        pack="fa-solid" />
    </NeoButton>
  </div>
</template>

<script lang="ts" setup>
import { NeoButton, NeoIcon } from '@kodadot1/brick'

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
@import '@/assets/styles/abstracts/variables';

.square-20 {
  width: 20px;
  height: 20px;
}

.pill-tabs-container {
  gap: 10px;

  @include touch {
    flex-wrap: wrap !important;
  }
}
</style>
