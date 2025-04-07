<template>
  <div>
    <NeoAutocomplete
      v-model="search"
      :data="data"
      root-class="neo-input"
      debounce-typing="300"
      open-on-focus
      clearable
      item-class="hover:bg-k-accent-light!"
      :placeholder="placeholder"
      @typing="onSearchFn"
      @select="onSelect"
    >
      <template
        v-if="loading"
        #header
      >
        <div class="text-k-grey!">
          {{ $t('loading') }}...
        </div>
      </template>
      <template
        v-else-if="!data?.length"
        #empty
      >
        <div class="text-k-grey!">
          {{ $t('general.searchNoResults') }}
        </div>
      </template>
      <template
        v-else
        #default="{ option }"
      >
        <slot :item="option" />
      </template>
    </NeoAutocomplete>
  </div>
</template>

<script setup lang="ts">
import { NeoAutocomplete } from '@kodadot1/brick'

const emit = defineEmits(['select'])
const props = defineProps<{
  placeholder?: string
  onSearch: (search: string) => Promise<any[]>
}>()

const search = ref('')
const loading = ref(false)
const items = ref()
const data = computed(() => loading.value ? [] : items.value)

const onSearchFn = async () => {
  loading.value = true
  const response = await props.onSearch(search.value)
  items.value = response
  loading.value = false
}

const onSelect = (selected) => {
  emit('select', selected)
}

onBeforeMount(onSearchFn)
</script>

<style lang="scss" scoped>
.search-input {
  @apply w-full;
}
</style>
