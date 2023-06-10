<template>
  <div>
    <div v-if="showExplainerText && isLogIn" class="mb-2">
      <small>
        {{ $t('createNftExplainer') }}
      </small>
    </div>
    <NeoSelect
      v-model="selectedCollection"
      :label="$t('collection')"
      :placeholder="$t('selectCollection')"
      :description="$t('selectCollectionDescription')"
      :options="selectOptions"
      expanded />
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import { BaseMintedCollection as MintedCollection } from './types'
import { NeoSelect } from '@kodadot1/brick'
import { useIdentityStore } from '~~/stores/identity'

const props = defineProps({
  collections: {
    type: Array as () => MintedCollection[],
    default: () => [],
  },
  showExplainerText: {
    type: Boolean,
    default: true,
  },
  modelValue: {
    type: Object as () => MintedCollection | null,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'update:super'])

const selectedCollection = useVModel(props, 'modelValue', emit)

const identityStore = useIdentityStore()

const isLogIn = computed(() => Boolean(identityStore.getAuthAddress))

const selectOptions = computed(() => [
  { text: '--', value: '' },
  ...props.collections.map((collection) => ({
    value: collection,
    text: collection.name || collection.id,
  })),
])
</script>
