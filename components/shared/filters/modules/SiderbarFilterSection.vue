<template>
  <NeoCollapse
    :open="expanded"
    animation="slide"
    class="border-b"
    :class="{ 'fluid-padding-left': fluidPadding }"
  >
    <template #trigger="{ open }">
      <div
        class="flex"
        role="button"
        :aria-expanded="open"
      >
        <p class="card-header-title font-normal">
          {{ title }}
        </p>
        <a class="card-header-icon">
          <KIcon :name="open ? 'i-mdi:minus' : 'i-mdi:plus'" />
        </a>
      </div>
    </template>
    <div class="p-4">
      <slot />
    </div>
  </NeoCollapse>
</template>

<script lang="ts" setup>
import { NeoCollapse } from '@kodadot1/brick'

withDefaults(
  defineProps<{
    title: string
    expanded?: boolean
    fluidPadding?: boolean
  }>(),
  {
    expanded: false,
    fluidPadding: false,
  },
)
</script>
