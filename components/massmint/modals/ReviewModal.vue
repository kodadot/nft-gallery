<template>
  <NeoModal v-model="isModalActive" scroll="clip" @close="emit('close')">
    <div class="px-5">
      <header class="card-header border-bottom">
        <p class="card-header-title is-flex is-justify-content-center px-0">
          Final Mass Mint Overview
        </p>
      </header>
      <div class="card-content">
        <div>
          <ul class="ml-4">
            <li>
              <span class="has-text-weight-bold">{{ numNfts }} NFTs </span> will
              be minted
            </li>
          </ul>
          <div v-if="numMissingDescriptions" class="has-text-k-red mt-3">
            <span>Note</span>
            <ul class="ml-4">
              <li>Missing Description {{ numMissingDescriptions }} NFTs</li>
            </ul>
          </div>
          <div class="mt-3 limit-note-width">
            Do you really want to proceed?
          </div>
        </div>
        <div class="is-flex pt-5">
          <NeoButton
            label="Yes, Mint NFTs"
            :variant="mintBtnVariant"
            class="min-width is-flex is-flex-grow-1"
            @click.native="emit('close')" />
          <NeoButton
            label="Cancel"
            :variant="cancelBtnVariant"
            class="min-width ml-5 is-flex is-flex-grow-1"
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
  props.numMissingDescriptions ? 'k-primary' : 'k-accent'
)
const cancelBtnVariant = computed(() =>
  props.numMissingDescriptions ? 'k-accent' : 'k-primary'
)

const isModalActive = useVModel(props, 'value')

const emit = defineEmits(['close'])
</script>

<style lang="scss" scoped>
li {
  list-style-type: disc;
}

.limit-note-width {
  max-width: 20rem;
}

.min-width {
  min-width: 10rem;
}
</style>
