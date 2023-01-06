<template>
  <o-button
    :class="{
      active: active,
      'is-fixed-width': fixedWidth,
      'no-shadow': noShadow,
      selected: selected,
    }"
    :size="size"
    :icon-right="icon"
    :variant="variant"
    icon-pack="fas"
    class="is-neo">
    {{ label }}
  </o-button>
</template>

<script lang="ts" setup>
import { OButton } from '@oruga-ui/oruga'
import { TranslateResult } from 'vue-i18n'
import { NeoButtonVariant } from '@kodadot1/brick'

defineProps<{
  size?: 'small' | 'medium' | 'large'
  icon?: string
  label?: string | TranslateResult
  active?: boolean
  fixedWidth?: boolean
  noShadow?: boolean
  selected?: boolean
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
  -webkit-box-shadow: 4px 4px hsl(0deg, 0%, 4%);
  box-shadow: 4px 4px hsl(0deg, 0%, 4%);
  font-family: inherit;
  padding-top: 8px;
  padding-bottom: 8px;

  &:hover {
    background: $k-accentlight;
  }

  &:active {
    background-color: $k-accentlight;
  }

  &.selected {
    background: $dark-accent;
    color: $white;
  }
}

.dark-mode {
  .is-neo {
    color: hsl(0deg, 0%, 100%);
    background: hsl(330, 4%, 9%);
    border: 1px solid hsl(0deg, 0%, 100%);
    -webkit-box-shadow: 4px 4px hsl(0deg, 0%, 100%);
    box-shadow: 4px 4px hsl(0deg, 0%, 100%);

    &:hover {
      background: $k-accent;
      color: hsl(0deg, 0%, 4%);
    }

    &:active {
      background-color: $k-accent;
    }
  }

  .o-btn {
    &--k-accent {
      background: $k-accent;
      color: $black;

      &:hover {
        background: $k-dark !important;
        color: $white;
      }
    }

    &--k-blue {
      background-color: $k-blue;
      color: $black;

      &:hover {
        background: $k-dark !important;
        color: $white;
      }
    }
  }

  &.selected {
    background: $white;
    color: $black;
  }
}

.dark-mode {
  .is-neo {
    color: hsl(0deg, 0%, 100%);
    background: hsl(330, 4%, 9%);
    border: 1px solid hsl(0deg, 0%, 100%);
    -webkit-box-shadow: 4px 4px hsl(0deg, 0%, 100%);
    box-shadow: 4px 4px hsl(0deg, 0%, 100%);
    &:hover {
      background: $k-accent;
      color: hsl(0deg, 0%, 4%);
    }
    &:active {
      background-color: $k-accent;
    }
  }
  .o-btn {
    &--k-accent {
      background: $k-accent;
      color: $black;
      &:hover {
        background: $k-dark !important;
        color: $white;
      }
    }
    &--k-blue {
      background-color: $k-blue;
      color: $black;
      &:hover {
        background: $k-dark !important;
        color: $white;
      }
    }
    &--connect-dropdown {
      background: $k-dark !important;
      &:hover {
        border: 1px solid $white !important;
        background: $k-accent !important;
        color: $black !important;
      }
    }
  }
}
.o-btn {
  &--k-accent {
    background-color: $k-accent;

    &:hover {
      background: $white !important;
    }
  }
  &--k-blue {
    background-color: $k-blue;

    &:hover {
      background: $white !important;
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
    box-shadow: none;
  }
}
.is-fixed-width {
  width: 10rem;
}
</style>
