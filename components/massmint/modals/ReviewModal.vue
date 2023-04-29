<template>
  <NeoModal v-model="isModalActive" scroll="clip" @close="emit('close')">
    <div class="p-6 modal-width">
      <div class="border-bottom border-grey">
        <p class="is-flex is-justify-content-center pb-4 is-size-5">
          {{ $t('massmint.reviewTtile') }}
        </p>
      </div>
      <div class="pt-4">
        <div>
          <span class="has-text-weight-bold"> • {{ numNfts }} NFTs </span>
          {{ $t('massmint.willBeMinted') }}

          <div v-if="numMissingDescriptions" class="has-text-k-red mt-4">
            <div>{{ $t('massmint.note') }}</div>
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
            {{ $t('massmint.reallyProcceed') }}
          </div>
        </div>
        <div class="is-flex pt-6">
          <NeoButton
            :label="$t('massmint.yesMint')"
            :variant="mintBtnVariant"
            no-shadow
            class="min-width btn-height is-flex is-flex-1"
            @click.native="emit('mint')" />
          <NeoButton
            :label="$t('massmint.cancel')"
            :variant="cancelBtnVariant"
            no-shadow
            class="min-width ml-5 btn-height is-flex is-flex-1"
            @click.native="emit('close')" />
        </div>
      </div>
    </div>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoButton, NeoModal } from '@kodadot1/brick'

const props = defineProps<{
  value: boolean
  numNfts: number
  numMissingDescriptions: number
  numMissingPrices: number
}>()

const mintBtnVariant = computed(() =>
  props.numMissingDescriptions ? 'primary' : 'k-accent'
)
const cancelBtnVariant = computed(() =>
  props.numMissingDescriptions ? 'k-accent' : 'primary'
)

const isModalActive = useVModel(props, 'value')

const emit = defineEmits(['close', 'mint'])
</script>

<style lang="scss" scoped>
@import './modals.scss';

.min-width {
  min-width: 10rem;
}
</style>
