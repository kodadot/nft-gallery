<template>
  <NeoField>
    <NeoDropdown
      v-if="multipleSelect"
      v-model="selectedAction"
      multiple
      class="select-dropdown">
      <template #trigger>
        <NeoButton
          type="primary"
          no-shadow
          icon-right="caret-down"
          data-testid="gallery-sort-by">
          {{ $t('sort.collection.sortBy') }}
        </NeoButton>
      </template>
      <NeoDropdownItem
        v-for="action in actions"
        :key="action"
        :value="action"
        :data-testid="$t('sort.' + action)">
        {{ $t('sort.' + action) }}
      </NeoDropdownItem>
    </NeoDropdown>
    <NeoSelect
      v-else
      v-model="selectedAction"
      :placeholder="$t('sort.collection.sortBy')"
      class="select-dropdown"
      data-testid="collection-sort-by">
      <option v-for="action in actions" :key="action" :value="action">
        {{
          isCollection ? $t('sort.collection.' + action) : $t('sort.' + action)
        }}
      </option>
    </NeoSelect>
  </NeoField>
</template>

<script setup lang="ts">
import {
  NFT_SQUID_SORT_CONDITION_LIST,
  NFT_SQUID_SORT_CONDITION_LIST_FOR_MOONRIVER,
} from '@/utils/constants'
import {
  NeoButton,
  NeoDropdown,
  NeoDropdownItem,
  NeoField,
  NeoSelect,
} from '@kodadot1/brick'

const emit = defineEmits(['input'])
const props = defineProps({
  value: {
    type: String,
    required: true,
  },
  sortOption: Array,
  multipleSelect: Boolean,
  isCollection: {
    type: Boolean,
    default: false,
  },
})

const selectedAction = computed({
  get: () => props.value,
  set: (value) => {
    emit('input', value)
  },
})

const { urlPrefix } = usePrefix()

const isMoonriver = computed(() => {
  return urlPrefix.value === 'moonr'
})

const actions = computed(() => {
  return props.sortOption || sort.value
})

const sort = computed(() => {
  if (isMoonriver.value) {
    return NFT_SQUID_SORT_CONDITION_LIST_FOR_MOONRIVER
  }
  return NFT_SQUID_SORT_CONDITION_LIST
})
</script>

<style lang="scss">
/* cry in scss (global) */
.select-dropdown {
  select {
    border: 1px solid #7d7d7d !important;
  }
  @media screen and (max-width: 1216px) and (min-width: 768px) {
    width: 200px;
  }
}
</style>
