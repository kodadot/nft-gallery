<template>
  <div>
    <NeoCollapse :disabled="disabled">
      <div>
        {{ $t('massmint.uploadPics') }}
        <NeoIcon
          v-if="showCheckmark"
          icon="circle-check"
          size="small"
          variant="success"
          class="ml-3" />
      </div>
      <template #content>
        <DropUpload @fileSelected="onFileSelected" />
      </template>
    </NeoCollapse>
  </div>
</template>

<script setup lang="ts">
import { NeoCollapse, NeoIcon } from '@kodadot1/brick'

withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  {
    disabled: false,
  }
)

const showCheckmark = ref(false)

const DropUpload = defineAsyncComponent(() => import('./DropUpload.vue'))

const onFileSelected = (ready, zipData) => {
  showCheckmark.value = ready
}
</script>
