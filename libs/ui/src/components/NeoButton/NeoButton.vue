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
import { NeoButtonVariant } from '@kodadot1/brick'

defineProps<{
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  icon?: string
  label?: string
  active?: boolean
  fixedWidth?: boolean
  noShadow?: boolean
  variant?: NeoButtonVariant
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
  -webkit-box-shadow: $primary-shadow;
  box-shadow: $primary-shadow;
  font-family: inherit;
  padding-top: 8px;
  padding-bottom: 8px;

  &:hover {
    background: $k-accentlight;
  }

  &:active {
    background-color: $k-accentlight;
  }
}

.o-btn {
  &--k-accent {
    background-color: $k-accent;

    &:hover {
      background: $white;
    }
    &:hover {
      background: white;
    }
    &.o-btn--disabled {
      opacity: unset;
      background-color: $shade;
      color: $k-grey;
      border-color: $k-grey;
    }
  }
  &--k-blue {
    background-color: $k-blue;

    &:hover {
      background: $white;
    }
    &:hover {
      background: white;
    }
    &.o-btn--disabled {
      opacity: unset;
      background-color: $shade;
      color: $k-grey;
      border-color: $k-grey;
    }
  }
  &--connect-dropdown {
    width: 120px;
    height: 40px;
    background: $white;
    &:hover {
      border: 1px solid $black;
      background: $k-accentlight !important;
      color: $black !important;
    }
  }
  &.no-shadow {
    box-shadow: none !important;
  }
}

.dark-mode {
  .is-neo {
    color: hsl(0deg, 0%, 100%);
    background: hsl(330, 4%, 9%);
    border: 1px solid hsl(0deg, 0%, 100%);
    -webkit-box-shadow: $primary-shadow-dark;
    box-shadow: $primary-shadow-dark;

    &:hover {
      background: $k-accent;
      color: hsl(0deg, 0%, 4%);
    }
    &.active {
      color: hsl(0deg, 0%, 4%);
      background-color: hsl(0deg, 0%, 100%);
    }
  }

  .o-btn {
    &--k-accent {
      color: hsl(0deg, 0%, 4%);
      background-color: $k-accent;
      &:hover {
        color: hsl(0deg, 0%, 100%);
        background: hsl(0deg, 0%, 4%);
      }
      &.o-btn--disabled {
        opacity: unset;
        background-color: $k-grey;
        color: $shade;
        border-color: $shade;
      }
    }

    &--k-blue {
      color: hsl(0deg, 0%, 4%);
      background-color: $k-blue;
      &:hover {
        color: hsl(0deg, 0%, 100%);
        background: hsl(0deg, 0%, 4%);
      }
      &.o-btn--disabled {
        opacity: unset;
        background-color: $k-grey;
        color: $shade;
        border-color: $shade;
      }
    }
  }
}
.is-fixed-width {
  width: 10rem;
}
</style>
