<template>
  <div v-if="isLoading">
    <SearchResultItem v-for="item in 5" :key="item" is-loading />
  </div>
  <div v-else-if="!profileSuggestion.length" class="mx-6 mt-4">
    {{ $t('search.profileNotFound', [name]) }}
  </div>
  <div v-else>
    <div
      v-for="item in profileSuggestion"
      :key="item.address"
      :value="item"
      class="link-item"
      @click="openProfilePage(item.address)">
      <SearchResultItem :image="item.image">
        <template #content>
          <div class="flex flex-row justify-between pt-2 pr-2">
            <span
              class="font-bold max-w-[34ch] overflow-hidden text-ellipsis whitespace-nowrap"
              >{{ item.name }}</span
            >
          </div>
          <div class="flex flex-row justify-between pr-2">
            <span
              class="max-w-[34ch] overflow-hidden text-ellipsis whitespace-nowrap"
              >{{ item?.description }}</span
            >
          </div>
        </template>
      </SearchResultItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { searchProfiles } from '@/services/profile'
import type { Profile } from '@/services/profile'
import { useQuery } from '@tanstack/vue-query'
import { isEthereumAddress } from '@polkadot/util-crypto'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})

const router = useRouter()
const { urlPrefix } = usePrefix()
const { isEvm } = useIsChain(urlPrefix)

const emit = defineEmits(['close'])

const { data: result, isLoading } = useQuery<{ data: Profile[] } | null>({
  queryKey: ['search-profiles', computed(() => props.name)],
  queryFn: () => (props.name ? searchProfiles(props.name, 10) : null),
})

const profileSuggestion = computed(() => result.value?.data || [])

const openProfilePage = (address: string) => {
  if (isEthereumAddress(address)) {
    const prefix = isEvm.value ? urlPrefix.value : 'base'
    router.push(`/${prefix}/u/${address}`)
  } else {
    const prefix = isEvm.value ? 'ahp' : urlPrefix.value
    router.push(`/${prefix}/u/${address}`)
  }
  emit('close')
}
</script>
