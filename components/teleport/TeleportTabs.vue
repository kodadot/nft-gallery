<template>
  <div class="teleport-tabs field has-addons flex" data-testid="tabs">
    <p class="control">
      <NeoButton
        v-for="tab in tabs"
        :key="tab.value"
        class="teleport-tabs-button"
        :tag="NuxtLink"
        :disabled="tab.disabled?.value"
        :variant="tab.disabled?.value ? 'disabled-secondary' : undefined"
        :active="value === tab.value"
        to=""
        @click="emit('select', tab.value)">
        <span> {{ tab.label }}</span>
        <img v-if="value === tab.value" src="/checkmark.svg" />
      </NeoButton>
    </p>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { Chain } from '@/utils/teleport'
import { resolveComponent } from 'vue'

const NuxtLink = resolveComponent('NuxtLink')
type Tab = {
  label: string
  value: Chain
  disabled?: ComputedRef<boolean>
}
defineProps<{
  tabs: Tab[]
  value: string
}>()
const emit = defineEmits(['select'])
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.teleport-tabs {
  .teleport-tabs-button {
    width: 15rem;
  }

  @include mobile {
    .control,
    &-button {
      width: 100%;
    }
  }
}

.dark-mode .teleport-tabs-button.active img {
  filter: brightness(0%);
}
</style>
