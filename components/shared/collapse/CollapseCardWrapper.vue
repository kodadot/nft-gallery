<template>
  <div class="block">
    <NeoCollapse
      class="card bordered"
      animation="slide"
      aria-id="contentIdForHistory"
      :open="isOpen"
    >
      <template #trigger="props">
        <div
          class="card-header"
          role="button"
          aria-controls="contentIdForHistory"
        >
          <p class="card-header-title">
            {{ $t(label) }}
          </p>
          <a class="card-header-icon">
            <KIcon :name="props.open ? 'i-mdi:chevron-up' : 'i-mdi:chevron-down'" />
          </a>
        </div>
      </template>
      <div class="card-content">
        <div class="content">
          <slot />
        </div>
      </div>
    </NeoCollapse>
  </div>
</template>

<script lang="ts" setup>
import { NeoCollapse } from '@kodadot1/brick'

withDefaults(
  defineProps<{
    label: string
  }>(),
  {
    label: 'label',
  },
)
const isOpen = ref(false)
</script>
