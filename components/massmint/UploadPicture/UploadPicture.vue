<template>
  <div>
    <NeoCollapseStack>
      <NeoCollapse>
        <template #title> {{ $t('massmint.uploadPics') }}</template>
        <template #content>
          <DropUpload
            preview
            :label="$t('mint.collection.massmintDrop')"
            accept="image/*, audio/*, .zip"
            @input="selectedFile" />
        </template>
      </NeoCollapse>
      <NeoCollapse>
        <template #title> {{ $t('massmint.uploadDesc') }} </template>
        <template #content> custom content </template>
      </NeoCollapse>
    </NeoCollapseStack>
  </div>
</template>

<script setup lang="ts">
import { NeoCollapse, NeoCollapseStack } from '@kodadot1/brick'

const DropUpload = defineAsyncComponent(
  () => import('@/components/shared/upload/DropUpload.vue')
)

const selectedFile = (file) => {
  console.log('selected file', file)
}
</script>
