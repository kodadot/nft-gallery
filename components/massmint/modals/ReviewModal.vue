<template>
  <NeoModal v-model="isModalActive" scroll="clip" @close="emit('close')">
    <div class="p-5">
      <header class="border-bottom">
        <p class="is-flex is-justify-content-center pb-2 is-size-5">
          {{ $t('massmint.reviewTtile') }}
        </p>
      </header>
      <div class="card-content">
        <div>
          <span class="has-text-weight-bold"> • {{ numNfts }} NFTs </span>
          {{ $t('massmint.willBeMinted') }}

          <div v-if="numMissingDescriptions" class="has-text-k-red mt-3">
            <div>{{ $t('massmint.note') }}</div>
            <div class="pl-3">
              •
              {{
                $t('massmint.missingDescription', {
                  count: numMissingDescriptions,
                })
              }}
            </div>
          </div>
          <div class="mt-3 limit-note-width">
            {{ $t('massmint.reallyProcceed') }}
          </div>
        </div>
        <div class="is-flex pt-5">
          <NeoButton
            :label="$t('massmint.yesMint')"
            :variant="mintBtnVariant"
            class="min-width is-flex is-flex-1"
            @click.native="emit('mint')" />
          <NeoButton
            :label="$t('massmint.cancel')"
            :variant="cancelBtnVariant"
            class="min-width ml-5 is-flex is-flex-1"
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
.limit-note-width {
  max-width: 20rem;
}

.min-width {
  min-width: 10rem;
}
</style>
