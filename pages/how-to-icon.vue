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

    <div class="flex flex-col gap-2 mt-2">
      <div
        v-for="size in customSize"
        :key="size"
        class="flex items-center gap-4"
      >
        <p>{{ size }} size:</p>
        <NeoIcon
          icon="circle-info"
          :custom-size="size"
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

const customSize = [
  'fa-2x',
  'fa-3x',
]

const sizeMap = {
  'default': '',
  'small': 'size-4',
  'medium': 'size-6',
  'large': 'size-8',
  'fa-2x': 'size-10',
  'fa-3x': 'size-14',
}
</script>
