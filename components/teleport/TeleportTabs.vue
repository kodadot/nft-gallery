<template>
  <div class="teleport-tabs field has-addons is-flex" data-cy="tabs">
    <p class="control">
      <NeoButton
        v-for="tab in tabs"
        :key="tab.value"
        class="teleport-tabs-button"
        tag="nuxt-link"
        :active="value === tab.value"
        to=""
        @click.native="emit('select', tab.value)">
        <span> {{ tab.label }}</span>
        <img v-if="value === tab.value" src="/checkmark.svg" />
      </NeoButton>
    </p>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'

type Tab = {
  label: string
  value: string
}
defineProps<{
  tabs: Tab[]
  value: string
}>()
const emit = defineEmits(['select'])
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.teleport-tabs {
  &-button {
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
