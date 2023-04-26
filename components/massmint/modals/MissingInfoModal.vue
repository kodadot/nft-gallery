<template>
  <NeoModal v-model="isModalActive" scroll="clip" @close="emit('close')">
    <div class="px-5">
      <header class="card-header border-bottom">
        <p class="card-header-title is-flex is-justify-content-center px-0">
          {{ $t('massmint.missingRequiredInfo') }}
        </p>
      </header>
      <div class="card-content">
        <div>
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
          </div>
          <div class="mt-3 limit-note-width">
            {{ $t('massmint.cantMintNote') }}
          </div>
        </div>
        <div class="is-flex is-justify-content-center pt-5">
          <NeoButton
            :label="$t('massmint.goBack')"
            variant="k-accent"
            class="is-flex is-flex-grow-1"
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
  numMissingNames: number
  numMissingDescriptions: number
}>()

const isModalActive = useVModel(props, 'value')

const emit = defineEmits(['close'])
</script>

<style lang="scss" scoped>
.limit-note-width {
  max-width: 20rem;
}
</style>
