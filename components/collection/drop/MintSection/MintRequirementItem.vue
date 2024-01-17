<template>
  <div class="flex items-center">
    <NeoIcon class="mr-4" :icon="icon.name" :class="icon.class" />

    <slot />
  </div>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'

const props = defineProps<{
  fulfilled: boolean
}>()

const { accountId } = useAuth()

const icon = computed<{ name: string; class: string }>(() => {
  if (!accountId.value) {
    return {
      name: 'lock-keyhole',
      class: 'text-k-grey',
    }
  }

  return props.fulfilled
    ? {
        name: 'check',
        class: 'text-k-green',
      }
    : { name: 'xmark', class: 'text-k-red' }
})
</script>
