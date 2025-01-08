<template>
  <SearchInput
    placeholder="Search by name"
    :on-search="onSearch"
    @select="s => $emit('select', s)"
  >
    <template
      #default="{ item }"
    >
      <div
        :key="item.id"
        class="flex items-center gap-2"
      >
        <BaseMediaItem
          class="border border-border-color w-8 h-8"
          :src="sanitizeIpfsUrl(item.meta.image)"
          :alt="item.name"
        />
        <div class="flex flex-col">
          <div class="text-sm font-semibold text-text-color">
            {{ item.name }}
          </div>
          <div class="text-xs text-k-grey">
            {{ item.collection?.name }}
          </div>
        </div>
      </div>
    </template>
  </SearchInput>
</template>

<script setup lang="ts">
import { sanitizeIpfsUrl } from '@/utils/ipfs'

defineEmits(['select'])
const props = defineProps<{
  where: Record<string, unknown>
}>()

const onSearch = async (searchKey: string) => {
  const search = {
    name_containsInsensitive: searchKey,
  }

  if (props.where) {
    Object.assign(search, props.where)
  }

  const { data } = await useAsyncGraphql({
    query: 'nftListWithSearch',
    variables: {
      search: search,
      first: 5,
    },
  })

  return data.value.nFTEntities
}
</script>
