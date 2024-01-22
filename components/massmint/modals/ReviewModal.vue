<template>
  <NeoModal :value="isModalActive" scroll="clip" @close="emit('close')">
    <div class="p-6 modal-width">
      <div class="border-b border-grey">
        <p class="flex justify-center pb-4 is-size-5">
          {{ $t('massmint.reviewTtile') }}
        </p>
      </div>
      <div class="pt-4">
        <div>
          <span class="font-bold"> • {{ numNfts }} NFTs </span>
          {{ $t('massmint.willBeMinted') }}

          <div
            v-if="numMissingDescriptions || numMissingPrices"
            class="text-k-red mt-4">
            <div>{{ $t('massmint.note') }}</div>
            <div v-if="numMissingDescriptions" class="pl-3">
              •
              {{
                $t('massmint.missingDescription', {
                  count: numMissingDescriptions,
                })
              }}
            </div>
            <div v-if="numMissingPrices" class="pl-3">
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
        <div class="flex pt-6">
          <NeoButton
            :label="$t('massmint.yesMint')"
            :variant="mintBtnVariant"
            no-shadow
            class="min-width btn-height flex flex-1"
            @click="emit('mint')" />
          <NeoButton
            :label="$t('massmint.cancel')"
            :variant="cancelBtnVariant"
            no-shadow
            class="min-width ml-5 btn-height flex flex-1"
            @click="emit('close')" />
        </div>
      </div>
    </div>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoButton, NeoModal } from '@kodadot1/brick'

const props = defineProps<{
  modelValue: boolean
  numNfts: number
  numMissingDescriptions: number
  numMissingPrices: number
}>()

const mintBtnVariant = computed(() =>
  props.numMissingDescriptions ? 'primary' : 'k-accent',
)
const cancelBtnVariant = computed(() =>
  props.numMissingDescriptions ? 'k-accent' : 'primary',
)

const isModalActive = useVModel(props, 'modelValue')

const emit = defineEmits(['close', 'mint'])
</script>

<style lang="scss" scoped>
@import './modals.scss';

.min-width {
  min-width: 10rem;
}
</style>
