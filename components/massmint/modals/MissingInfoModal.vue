<template>
  <NeoModal v-model="isModalActive" scroll="clip" @close="emit('close')">
    <div class="p-6 modal-width">
      <div class="border-bottom border-grey">
        <p
          class="has-text-weight-bold pb-4 is-size-5 is-flex is-justify-content-center px-0">
          {{ $t('massmint.missingRequiredInfo') }}
        </p>
      </div>
      <div class="pt-4">
        <div class="has-text-weight-bold has-text-k-red">
          <div>{{ $t('massmint.required') }}</div>

          <div class="pl-3">
            • {{ $t('massmint.incompleteNfts', { count: numMissingNames }) }}
          </div>
        </div>
        <div v-if="numMissingDescriptions" class="has-text-k-red mt-3">
          <div>{{ $t('massmint.optional') }}</div>

          <div class="pl-3">
            •
            {{
              $t('massmint.missingDescription', {
                count: numMissingDescriptions,
              })
            }}
          </div>
          <div class="pl-3">
            •
            {{
              $t('massmint.missingPrice', {
                count: numMissingPrices,
              })
            }}
          </div>
        </div>
        <div class="mt-6 limit-note-width">
          {{ $t('massmint.cantMintNote') }}
        </div>
      </div>
      <div class="is-flex is-justify-content-center pt-5 px-8">
        <NeoButton
          :label="$t('massmint.goBack')"
          variant="k-accent"
          no-shadow
          class="is-flex is-flex-grow-1 btn-height"
          @click.native="emit('close')" />
      </div>
    </div>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoButton, NeoModal } from '@kodadot1/brick'

const props = defineProps<{
  value: boolean
  numMissingNames: number
  numMissingDescriptions: number
  numMissingPrices: number
}>()

const isModalActive = useVModel(props, 'value')

const emit = defineEmits(['close'])
</script>

<style lang="scss" scoped>
@import './modals.scss';
</style>
