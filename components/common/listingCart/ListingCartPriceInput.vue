<template>
  <div class="is-flex">
    <input type="text" class="price-input" placeholder="Price" />
    <div
      class="border-top border-right border-bottom shade-border-color px-5 is-flex is-align-items-center">
      KSM
    </div>
    <NeoButton
      v-if="check"
      no-shadow
      class="check-btn ml-2 shade-border-color"
      icon="check" />
  </div>
</template>
<script setup lang="ts">
import { NeoButton } from '@/libs/ui'
defineProps<{ check?: boolean }>()
</script>

<style lang="scss">
.price-input {
  border: 1px solid #ccc;
  border-right: none;
  outline: none;
  width: 6em;
}

@import '@/styles/abstracts/variables';

.check-btn {
  height: 3rem;
}
.shade-border-color {
  @include ktheme() {
    border-color: theme('k-shade');
  }
}
</style>
