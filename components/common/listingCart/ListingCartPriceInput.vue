<template>
  <div class="is-flex">
    <input type="text" class="price-input height-40" placeholder="Price" />
    <div
      class="border-top border-right border-bottom shade-border-color px-5 is-flex is-align-items-center">
      KSM
    </div>
    <NeoButton
      v-if="check"
      no-shadow
      class="check-btn ml-2 shade-border-color height-40"
      icon="check" />
  </div>
</template>
<script setup lang="ts">
import { NeoButton } from '@/libs/ui'
defineProps<{ check?: boolean }>()
</script>

<style scoped lang="scss">
.price-input {
  border: 1px solid #ccc;
  border-right: none;
  outline: none;
  width: 5em;
}

.height-40 {
  height: 40px;
}
@import '@/styles/abstracts/variables';

.shade-border-color {
  @include ktheme() {
    border-color: theme('k-shade');
  }
}
</style>
