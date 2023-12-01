<template>
  <NeoDropdownItem @click="customizeCollectionModalActive = true">
    {{ $i18n.t('moreActions.customize') }}
  </NeoDropdownItem>

  <CollectionCustomizeModal
    v-model="customizeCollectionModalActive"
    :min="min"
    :max="max"
    @customize="closeModal" />
</template>

<script setup lang="ts">
import { NeoDropdownItem } from '@kodadot1/brick'

withDefaults(
  defineProps<{
    min: number
    max: number
  }>(),
  {
    min: undefined,
    max: undefined,
  },
)

const { $i18n } = useNuxtApp()
const customizeCollectionModalActive = ref(false)

const closeModal = () => {
  customizeCollectionModalActive.value = false
}
</script>
