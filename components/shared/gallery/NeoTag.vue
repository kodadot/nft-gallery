<template>
  <!-- NeoTag -->
  <div
    attached
    closable
    class="tag"
    data-testid="neo-tag-component"
    :class="[`tag--${variant}`, `tag-size--${size}`]"
  >
    <slot />
    <NeoIcon
      v-if="closable"
      aria-close-label="clear filter"
      icon="xmark"
      class="ml-2 cursor-pointer cross-icon"
      @click="onClose"
    />
  </div>
</template>

<script lang="ts" setup>
import { NeoIcon } from '@kodadot1/brick'

type TagSize = 'small' | 'medium'
type TagVariant = 'primary' | 'k-blue' | 'transparent'

withDefaults(
  defineProps<{
    closable?: boolean
    size?: TagSize
    variant?: TagVariant
  }>(),
  {
    closable: false,
    size: 'medium',
    variant: 'primary',
  },
)

const emit = defineEmits(['close'])
const onClose = () => {
  emit('close')
}
</script>
