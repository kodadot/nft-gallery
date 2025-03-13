<template>
  <div class="flex flex-col w-full">
    <slot />
    <div
      v-if="show"
      class="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-md p-3 !mt-2"
    >
      <KIcon
        name="i-mdi:alert-circle-outline"
        class="text-yellow-500"
        size="small"
      />

      <div>
        <p class="text-sm text-yellow-700">
          {{ $t('mint.notRecommendedModify') }}
        </p>
        <div
          v-if="!disabledUndo"
          class="w-full flex justify-end"
        >
          <NeoButton
            variant="text"
            class="flex items-center gap-1 text-sm !text-yellow-600 hover:!text-yellow-700 capitalize"
            @click="emit('undo')"
          >
            <NeoIcon
              icon="undo"
              size="small"
            />
            {{ $t('general.undo') }}
          </NeoButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoButton, NeoIcon } from '@kodadot1/brick'

defineProps<{
  show: boolean
  disabledUndo?: boolean
}>()

const emit = defineEmits(['undo'])
</script>
