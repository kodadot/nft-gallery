<template>
  <o-button
    :class="{
      active: active,
      'is-fixed-width': fixedWidth,
      'no-shadow': noShadow,
    }"
    :size="size"
    :icon-right="icon"
    :variant="variant"
    :disabled="disabled"
    icon-pack="fas"
    class="is-neo">
    {{ label }}
  </o-button>
</template>

<script lang="ts" setup>
import { OButton } from '@oruga-ui/oruga'

defineProps<{
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  icon?: string
  label?: string
  active?: boolean
  fixedWidth?: boolean
  noShadow?: boolean
  variant?:
    | 'primary'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'k-accent'
    | 'k-blue'
}>()
</script>

<style lang="scss" scoped>
@import '@oruga-ui/oruga/src/scss/oruga-full.scss';
@import '../../scss/variable.scss';

.is-neo {
  border-radius: 0;
  color: hsl(0deg, 0%, 4%);
  background: hsl(0deg, 0%, 100%);
  border: 1px solid hsl(0deg, 0%, 4%);
  -webkit-box-shadow: 4px 4px hsl(0deg, 0%, 4%);
  box-shadow: 4px 4px hsl(0deg, 0%, 4%);
  font-family: inherit;
  padding-top: 8px;
  padding-bottom: 8px;

  &:hover {
    background: #ffe5f3;
  }

  &.active {
    color: hsl(0deg, 0%, 100%);
    background-color: hsl(0deg, 0%, 4%);
  }
}

.dark-mode .is-neo {
  color: hsl(0deg, 0%, 100%);
  background: hsl(330, 4%, 9%);
  border: 1px solid hsl(0deg, 0%, 100%);
  -webkit-box-shadow: 4px 4px hsl(0deg, 0%, 100%);
  box-shadow: 4px 4px hsl(0deg, 0%, 100%);

  &:hover {
    background: #ff7ac3;
    color: hsl(0deg, 0%, 4%);
  }
  &.active {
    color: hsl(0deg, 0%, 4%);
    background-color: hsl(0deg, 0%, 100%);
  }
}

.o-btn {
  &--k-accent {
    background-color: $k-accent;
  }

  &--k-blue {
    background-color: $k-blue;
  }

  &.no-shadow {
    box-shadow: none;
  }
}

.is-fixed-width {
  width: 10rem;
}
</style>
