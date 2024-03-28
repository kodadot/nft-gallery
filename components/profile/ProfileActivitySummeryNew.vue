<template>
  <div v-if="stats" class="flex flex-col items-center gap-2.5">
    <div class="flex justify-between w-full items-center">
      <span class="text-sm text-k-grey"> Listed/Items </span>
      <span class="text-xl font-bold">
        {{ listedCount }}/{{ totalHoldingsNfts }}
      </span>
    </div>

    <div class="flex justify-between w-full items-center">
      <span class="text-sm text-k-grey"> Est. value </span>
      <span class="text-xl font-bold">
        <CommonTokenMoney :value="stats.listedValue" inline />
      </span>
    </div>

    <div class="flex justify-between w-full items-center">
      <span class="text-sm text-k-grey"> Followers </span>
      <span class="text-xl font-bold">
        {{ profileData?.followers ?? '-' }}
      </span>
    </div>

    <div class="flex justify-between w-full items-center">
      <span class="text-sm text-k-grey"> Following </span>
      <span class="text-xl font-bold">
        {{ profileData?.following ?? '-' }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getSumOfObjectField } from '@/utils/math'
import resolveQueryPath from '@/utils/queryPathResolver'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'
import { getDenyList } from '@/utils/prefix'

type Stats = {
  listedCount: number
  listedValue: number | bigint
  totalCollected: number
}

const props = defineProps<{
  userId?: string
  profileData?: UserProfileData
}>()

const { $consola } = useNuxtApp()
const route = useRoute()
const { client, urlPrefix } = usePrefix()

const id = computed(() => props?.userId || route.params.id || '')

const stats = ref<Stats>({
  listedCount: 0,
  listedValue: 0,
  totalCollected: 0,
})

const totalHoldingsNfts = computed(() => stats.value.totalCollected)
const listedCount = computed(() => stats.value.listedCount)

useLazyAsyncData('stats', async () => {
  if (!id.value) {
    $consola.warn('ProfilActivity: id is not defined')
    return
  }

  const query = await resolveQueryPath(client.value, 'profileStatsByIdRefined')
  const { data } = await useAsyncQuery({
    query: query.default,
    clientId: client.value,
    variables: {
      id: id.value,
      denyList: getDenyList(urlPrefix.value),
    },
  })

  if (!data.value) {
    $consola.log('stats is null')
    return
  }

  const listEvents: number[] = data.value.listed
    .filter((nft) => nft.events.length > 0)
    .map((nft) => nft.events[0])

  stats.value = {
    listedCount: listEvents.length,
    listedValue: getSumOfObjectField(listEvents, 'meta'),
    totalCollected: data.value?.obtained.totalCount,
  }
})
</script>
