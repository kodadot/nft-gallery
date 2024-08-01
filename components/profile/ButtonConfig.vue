<template>
  <NeoButton
    rounded
    no-shadow
    class="min-w-28"
    loading-with-label
    :data-testid="testId"
    :class="button.classes"
    :variant="button.variant"
    :active="button.active"
    :disabled="button.disabled || loading"
    :loading="loading"
    @click="button.onClick"
  >
    <NeoIcon
      v-if="button.icon"
      :icon="button.icon"
      class="mr-1"
    />
    {{ button.label }}
  </NeoButton>
</template>

<script lang="ts" setup>
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import type { ButtonConfig } from './types'

defineProps<{
  button: ButtonConfig
  loading?: boolean
  testId: string
}>()
</script>
