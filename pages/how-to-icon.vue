<template>
  <div class="min-h-screen max-w-2xl">
    <h1 class="text-2xl font-bold">
      Icon comparison
    </h1>

    <div class="flex flex-col gap-2">
      <div
        v-for="size in sizes"
        :key="size"
        class="flex items-center gap-4"
      >
        <p>{{ size }} size:</p>
        <NeoIcon
          icon="circle-info"
          :size="size"
        />
        <Icon
          name="i-mdi:information-slab-circle-outline"
          :class="sizeMap[size]"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'

const sizes = [
  'default',
  'small',
  'medium',
  'large',
]

const sizeMap = {
  default: '',
  small: 'size-4',
  medium: 'size-6',
  large: 'size-8',
}
</script>
