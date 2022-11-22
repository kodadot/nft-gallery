<template>
  <o-button
    :class="{ 'is-neo': true, active: active }"
    :size="size"
    :icon-right="icon"
    icon-pack="fas">
    {{ label }}
  </o-button>
</template>

<script lang="ts" setup>
import { OButton } from '@oruga-ui/oruga'

defineProps<{
  size?: string
  icon?: string
  label?: string
  active?: boolean
}>()
</script>

<style lang="scss" scoped>
@import '@oruga-ui/oruga/dist/oruga.min.css';
@import '@oruga-ui/oruga/dist/oruga-full-vars.min.css';
.is-neo {
  border-radius: 0;
  color: hsl(0deg, 0%, 4%);
  background: hsl(0deg, 0%, 100%);
  border: 1px solid hsl(0deg, 0%, 4%);
  -webkit-box-shadow: 4px 4px hsl(0deg, 0%, 4%);
  box-shadow: 4px 4px hsl(0deg, 0%, 4%);

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
    background: #ff47ac;
  }
  &.active {
    color: hsl(0deg, 0%, 4%);
    background-color: hsl(0deg, 0%, 100%);
  }
}
</style>
