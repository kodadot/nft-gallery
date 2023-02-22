<template>
  <div class="is-flex is-justify-content-flex-start is-align-items-end px-2">
    <NeoButton icon="twitter" icon-pack="fab" class="squere-32 mr-3" />
    <NeoButton icon="instagram" icon-pack="fab" class="squere-32 mr-3" />
    <NeoButton icon="discord" icon-pack="fab" class="squere-32" />
    <div class="vertical-seperator mx-4"></div>
    <NeoButton icon="share-alt" class="squere-32 mr-3" />
    <NeoButton icon="ellipsis-v" class="squere-32" />
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.squere-32 {
  width: 32px;
  height: 32px;
}
.vertical-seperator {
  height: 24px;
  margin-bottom: 4px;
  width: 1px;
  @include ktheme() {
    background-color: theme('border-color');
  }
}
</style>
