<template>
  <div>
    <p class="title is-6">
      {{ $t('mint.expert.count', [value.length]) }}
    </p>
    <NeoField :label="$t('mint.expert.batchSend')">
      <NeoInput
        type="textarea"
        :placeholder="'Distribute NFTs to multiple addresses like this:\n- HjshJ....3aJk\n- FswhJ....3aVC\n- HjW3J....9c3V'"
        spellcheck="true"
        custom-class="ap-textarea"
        @input="handleInput"></NeoInput>
    </NeoField>
  </div>
</template>

<script setup lang="ts">
import { parseBatchAddresses } from './utils'
import { NeoField, NeoInput } from '@kodadot1/brick'

const emit = defineEmits(['input'])
defineProps<{ value: string[] }>()
function handleInput(event: string): string[] {
  const address = parseBatchAddresses(event)
  emit('input', address)
  return address
}
</script>

<style lang="scss">
.ap-textarea {
  height: 400px !important;
}
</style>
