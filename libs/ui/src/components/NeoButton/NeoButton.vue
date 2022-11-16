<template>
  <o-button class="is-neo" :size="size" :icon-right="icon" icon-pack="fas">
    {{ label }}
  </o-button>
</template>

<script lang="ts" setup>
// import { Button } from 'buefy'
import { OButton } from '@oruga-ui/oruga'

defineProps<{
  size?: string
  icon?: string
  label?: string
}>()
</script>

<style lang="scss" scoped>
// @import "@oruga-ui/oruga/src/scss/oruga";
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
    background: #ffe5f3 !important;
  }
}

.dark-mode .is-neo {
  color: hsl(0deg, 0%, 100%);
  background: hsl(0deg, 0%, 4%);
  border: 1px solid hsl(0deg, 0%, 100%);
  -webkit-box-shadow: 4px 4px hsl(0deg, 0%, 100%);
  box-shadow: 4px 4px hsl(0deg, 0%, 100%);

  &:hover {
    background: #ff47ac !important;
  }
}
</style>
