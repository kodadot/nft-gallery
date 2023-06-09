<template>
  <div class="teleport-tabs field has-addons is-flex" data-cy="tabs">
    <p class="control">
      <NeoButton
        v-for="tab in tabs"
        :key="tab.value"
        class="teleport-tabs-button"
        tag="nuxt-link"
        :disabled="tab.disabled?.value"
        :variant="tab.disabled?.value && 'disabled-secondary'"
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
import { ComputedRef } from '@nuxt/bridge/dist/runtime/composables'

type Tab = {
  label: string
  value: string
  disabled?: ComputedRef<boolean>
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
  .teleport-tabs-button {
    width: 15rem;
    @include ktheme() {
      color: theme('text-color');

      &:hover {
        color: $black;
      }
      &.active {
        color: theme('text-color-inverse');
      }
    }
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
