<template>
  <div class="flex gap-2">
    <NeoButton
      variant="secondary"
      icon="trash"
      no-shadow
      @click="emit('clear')"
    />

    <NeoButton
      variant="secondary"
      no-shadow
      :label="$t('chooseFile')"
      @click="$refs.file.click()"
    />

    <input
      ref="file"
      type="file"
      class="hidden"
    >
  </div>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'
import { useEventListener } from '@vueuse/core'

const emit = defineEmits(['select', 'clear'])
const file = ref()

useEventListener(file, 'change', (e) => {
  const file = e.target?.files?.[0]
  file && emit('select', file)
})
</script>
