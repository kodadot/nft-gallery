<template>
  <NeoModal :value="value" @close="value = false">
    <div class="py-4 px-5 limit-width">
      <div class="flex mb-3 is-size-6">
        {{ $i18n.t('confirmDeleteCollection.deleteCollection') }}
      </div>
      <div class="text-k-grey text-xs mb-5">
        {{ $i18n.t('confirmDeleteCollection.content') }}
      </div>
      <div>
        <NeoButton
          class="font-bold mr-4"
          variant="text"
          no-shadow
          @click="emit('delete')">
          <span class="text-k-red">
            {{ $i18n.t('massmint.yesDelete') }}
          </span>
        </NeoButton>
        <NeoButton
          class="font-bold"
          variant="text"
          no-shadow
          :label="$i18n.t('cancel')"
          @click="value = false" />
      </div>
    </div>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoButton, NeoModal } from '@kodadot1/brick'

const { $i18n } = useNuxtApp()

const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits(['update:value', 'delete'])

const value = useVModel(props, 'modelValue')
</script>

<style lang="scss" scoped>
.limit-width {
  max-width: 314px;
}
</style>
