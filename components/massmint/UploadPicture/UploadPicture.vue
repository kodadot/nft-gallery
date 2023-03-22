<template>
  <div class="collpase-massmint">
    <NeoCollapse>
      <template #title> {{ $t('massmint.uploadPics') }}</template>
      <template #content>
        <DropUpload
          preview
          :label="$t('mint.collection.massmintDrop')"
          @input="selectedFile" />
      </template>
    </NeoCollapse>
  </div>
</template>

<script setup lang="ts">
import { NeoCollapse } from '@kodadot1/brick'

const DropUpload = defineAsyncComponent(
  () => import('@/components/shared/upload/DropUpload.vue')
)

const selectedFile = (file) => {
  console.log('selected file', file)
}
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.collpase-massmint {
  @include ktheme() {
    background-color: theme('background-color');
    color: theme('text-color');
    border: 1px solid theme('border-color');
    box-shadow: theme('primary-shadow');
  }
}
</style>
