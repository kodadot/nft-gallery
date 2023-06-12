<template>
  <div>
    <div v-if="showExplainerText && isLogIn" class="mb-2">
      <small>
        {{ $t('createNftExplainer') }}
      </small>
    </div>
    <NeoField>
      <template #label>
        <div>{{ $t('collection') }}</div>
        <div class="has-text-weight-light is-size-7 mb-3">
          {{ $t('selectCollectionDescription') }}
        </div>
      </template>
      <NeoSelect
        v-model="selectedCollection"
        :placeholder="$t('selectCollection')"
        :options="selectOptions"
        expanded />
    </NeoField>
  </div>
</template>

<script setup lang="ts">
import { BaseMintedCollection as MintedCollection } from './types'
import { NeoField, NeoSelect } from '@kodadot1/brick'

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

const { isLogIn } = useAuth()

const selectOptions = computed(() => [
  { text: '--', value: '' },
  ...props.collections.map((collection) => ({
    value: collection,
    text: collection.name || collection.id,
  })),
])
</script>
