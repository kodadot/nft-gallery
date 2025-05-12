<template>
  <div class="flex flex-col">
    <div class="flex justify-between items-center">
      <p>
        {{ $t('codeChecker.numberOfInputs') }}
      </p>

      <div
        v-if="!hideAverage"
        class="text-k-grey text-xs flex gap-3"
      >
        <p class="capitalize">
          {{ $t('codeChecker.timePerVariation') }}
        </p>
        <p>{{ average }}</p>
      </div>
    </div>

    <div class="flex gap-2 mt-4!">
      <NeoInput
        v-model="amount"
        class="max-w-52!"
        type="number"
        min="1"
      />
      <NeoButton
        no-shadow
        expanded
        class="h-[unset]!"
        @click="$emit('retry')"
      >
        <div class="inline-flex items-center gap-2">
          <span class="capitalize">
            {{ $t('codeChecker.retryTest') }}
          </span>
          <KIcon name="i-mdi:rotate-left" />
        </div>
      </NeoButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoButton, NeoInput } from '@kodadot1/brick'
import mean from 'lodash/mean'
import type { CanvasPreviewItem, CapturePreviewItem } from './types'

defineEmits(['retry'])
const props = defineProps<{
  modelValue: number
  previews: CapturePreviewItem[] | CanvasPreviewItem[]
  hideAverage?: boolean
}>()

const amount = useVModel(props, 'modelValue')

const average = computed(() => {
  const previews = props.previews
    .filter(preview => preview.renderedAt && preview.startedAt)
    .map(preview => preview.renderedAt! - preview.startedAt!)

  return previews.length ? `${(mean(previews) / 1000).toFixed(2)}s` : '-'
})
</script>
