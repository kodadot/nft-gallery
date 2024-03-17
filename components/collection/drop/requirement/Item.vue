<template>
  <div class="flex items-center">
    <NeoIcon
      class="mr-4"
      :icon="icon.name"
      :class="icon.class"
      :spin="icon.spin" />

    <slot />
  </div>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'

const props = withDefaults(
  defineProps<{
    fulfilled: boolean
    loading?: boolean
  }>(),
  {
    loading: false,
  },
)

const { accountId } = useAuth()

const icon = computed<{ name: string; class: string; spin?: boolean }>(() => {
  if (!accountId.value) {
    return {
      name: 'lock-keyhole',
      class: 'text-k-grey',
    }
  }

  if (props.loading) {
    return {
      name: 'spinner-third',
      class: 'text-k-grey',
      spin: true,
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
