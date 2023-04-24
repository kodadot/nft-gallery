<template>
  <div>
    <NeoCollapse :disabled="disabled">
      <div class="is-flex">
        {{ $t('massmint.overviewTable') }}
      </div>
      <template #content>
        <div>Overview table goes here</div>
      </template>
    </NeoCollapse>
  </div>
</template>

<script setup lang="ts">
import { NeoCollapse } from '@kodadot1/brick'

withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  {
    disabled: false,
  }
)
</script>
