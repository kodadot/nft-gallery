<template>
  <div>
    <NeoIcon
      :icon="icon.name"
      :class="['text-lg', icon.class]"
      :spin="icon.spin" />
    <span class="ml-[20px]">{{ description }}</span>
  </div>
</template>

<script lang="ts" setup>
import { NeoIcon } from '@kodadot1/brick'
import { Passed } from './types'

const props = defineProps<{
  passed: Passed
  description: string
}>()

const icon = computed(() => {
  if (props.passed === 'loading') {
    return {
      name: 'spinner-third',
      class: 'text-k-grey',
      spin: true,
    }
  }
  if (props.passed === 'unknown') {
    return {
      name: 'question',
      class: 'text-k-grey',
    }
  }

  return {
    name: props.passed ? 'check' : 'xmark',
    class: props.passed ? 'text-k-green' : 'text-k-red',
  }
})
</script>
