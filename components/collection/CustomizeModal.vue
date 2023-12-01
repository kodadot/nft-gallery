<template>
  <NeoModal :value="value" @close="value = false">
    <div class="py-4 px-5 limit-width">
      <div class="is-flex mb-3 is-size-6 has-text-weight-bold">
        {{ 'Customize Collection' }}
      </div>
      <div class="has-text-grey is-size-7 mb-5">
        This will update the Maximum items in your collection
      </div>
      <!-- collection max nfts -->
      <NeoField
        :label="$t('Maximum NFTs in collection')"
        data-testid="collection-maxAmount"
        required>
        <div class="w-full">
          <NeoInput
            v-model="max"
            type="number"
            :placeholder="`${min} is the minimum`"
            :min="min" />
        </div>
      </NeoField>
      <div class="is-flex is-justify-content-flex-end">
        <NeoButton
          class="has-text-weight-bold mr-4"
          variant="text"
          no-shadow
          @click="emit('customize')">
          <span class="has-text-k-green">
            {{ $t('Update') }}
          </span>
        </NeoButton>
        <NeoButton
          class="has-text-weight-bold"
          variant="text"
          no-shadow
          :label="$t('cancel')"
          @click="value = false" />
      </div>
    </div>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoButton, NeoField, NeoInput, NeoModal } from '@kodadot1/brick'

const props = defineProps<{
  modelValue: boolean
  min: number
}>()
const emit = defineEmits(['update:value', 'customize'])

const value = useVModel(props, 'modelValue')

const min = computed(() => props.min || 1)
const max = ref(undefined)
</script>

<style lang="scss" scoped>
.limit-width {
  max-width: 314px;
}
</style>
