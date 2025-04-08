<template>
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
type TagVariant = 'primary' | 'k-blue' | 'k-blue-2' | 'transparent' | 'k-green' | 'k-purple' | 'k-grey' | 'k-orange'

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

<style scoped>
@reference '@/assets/css/tailwind.css';

.tag {
  background: transparent;
  @apply text-base rounded-2xl text-text-color;

  &--primary {
    border: 1px solid var(--k-primary);
    background-color: var(--k-accent-light-2) !important;
    .cross-icon {
      &:hover {
        color: var(--k-grey);
      }
    }
  }

  &--transparent {
    border: 1px solid var(--border-color);
    background: transparent !important;
  }

  &--k-blue {
    border: 1px solid var(--k-blue) !important;
    background-color: var(--blue-light-hover-color) !important;
  }

  &--k-blue-2 {
    color: var(--k-blue) !important;
    background-color: var(--blue-light-hover-color) !important;
  }

  &--k-purple {
    color: var(--k-purple) !important;
    background-color: var(--k-purple-accent) !important;
  }

  &--k-orange {
    color: var(--k-orange4) !important;
    background-color: var(--k-yellow-light) !important;
  }

  &--k-green {
    color: var(--k-green) !important;
    background-color: var(--k-green-accent-2) !important;
  }

  &--k-grey {
    @apply text-neutral-7 bg-neutral-3 dark:bg-neutral-11;
  }

  &.tag-size {
    &--medium {
      padding: 0.75rem;
    }

    &--small {
      font-size: 0.75rem !important;
      padding: 0 0.5rem !important;
      height: min-content;
    }
  }

  .tag {
    margin-bottom: 0;
    padding: 0;
    background-color: inherit;
    color: var(--text-color);

    &:first-child {
      @apply cursor-default mr-[0.3rem];
    }
    &.is-delete {
      &:hover,
      &:focus {
        background-color: inherit;
        color: var(--k-grey);
      }
    }
  }
}
</style>
