<template>
  <NeoDropdown>
    <NeoButton icon="ellipsis-v" />

    <template #items>
      <NeoDropdownItem
        v-if="mimeType.includes('image') && ipfsImage"
        item="Download"
        @click.native="downloadMedia" />
      <NeoDropdownItem disabled item="Report" />
    </template>
  </NeoDropdown>
</template>

<script setup lang="ts">
import { NeoButton, NeoDropdown, NeoDropdownItem } from '@kodadot1/brick'
import { downloadImage } from '@/utils/download'
import { ipfsToCf } from '@/utils/ipfs'

const props = defineProps<{
  mimeType: string
  name?: string
  ipfsImage?: string
}>()

const downloadMedia = () => {
  props.ipfsImage && downloadImage(ipfsToCf(props.ipfsImage), props.name)
}
</script>
