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
        :value="selectedCollection"
        :placeholder="$t('selectCollection')"
        :options="collections"
        :text-key="
          (collection) =>
            `${collection.name || collection.id} (${collection.totalCount})`
        "
        :value-key="(collection) => collection"
        expanded
        @input="changeOption" />
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
  value: {
    type: Object as () => MintedCollection | null,
    default: null,
  },
})

const emit = defineEmits(['input'])

const selectedCollection = computed({
  get: () => props.value,
  set: (value) => emit('input', value),
})

const { isLogIn } = useAuth()

const changeOption = (collection: MintedCollection | null) => {
  selectedCollection.value = collection
}
</script>
