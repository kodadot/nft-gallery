<template>
  <div>
    <NeoCollapse>
      <NeoCollapseItem>
        <template #title> Upload Pictures </template>
        <template #content>
          <DropUpload
            :preview="true"
            :label="$t('mint.collection.massmintDrop')"
            format="BMP, GIF, JPEG, PNG, SVG, TIFF, WEBP, MP4, OGV, QUICKTIME, WEBM, GLB, FLAC, MP3, JSON"
            accept="image/*, audio/*"
            @input="selectedFile" />
        </template>
      </NeoCollapseItem>
      <NeoCollapseItem>
        <template #title> Upload Description File (Optional) </template>
        <template #content> custom content </template>
      </NeoCollapseItem>
    </NeoCollapse>
  </div>
</template>

<script setup lang="ts">
import { NeoCollapse, NeoCollapseItem } from '@kodadot1/brick'

const DropUpload = defineAsyncComponent(
  () => import('@/components/shared/upload/DropUpload.vue')
)

const selectedFile = (file) => {
  console.log('selected file', file)
}
</script>

<style lang="scss" scoped>
@import './UploadPicture.scss';
</style>
