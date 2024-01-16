<template>
  <div class="flex items-center">
    <NeoIcon class="mr-4" :icon="icon" :class="iconClass" />

    <div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'

const props = defineProps<{
  fulfilled: boolean
}>()

const { accountId } = useAuth()

const icon = computed(() => {
  if (!accountId.value) {
    return 'lock-keyhole'
  }

  return props.fulfilled ? 'check' : 'xmark'
})

const iconClass = computed(() => {
  if (!accountId.value) {
    return 'text-k-grey'
  }

  return props.fulfilled ? 'text-k-green' : 'text-k-red'
})
</script>

<style scoped></style>
