<template>
  <div v-if="stats" class="flex flex-col items-center gap-2.5">
    <div
      v-for="(item, index) in statsRows"
      :key="index"
      class="flex justify-between w-full items-center group"
      :class="{ 'cursor-pointer': item.onClick }"
      @click="item.onClick">
      <span class="text-sm text-k-grey">
        {{ $t(item.label) }}
      </span>
      <div
        class="text-lg font-bold"
        :class="{ 'group-hover:underline underline-offset-4': item.onClick }">
        <component
          :is="item.component"
          v-if="item.component"
          :value="item.value"
          inline />
        <span v-else>{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getSumOfObjectField } from '@/utils/math'
import resolveQueryPath from '@/utils/queryPathResolver'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'
import { getDenyList } from '@/utils/prefix'
import { Profile } from '@/services/profile'
import type ProfileStatsByIdRefined from '@/queries/types/subsquid/general/profileStatsByIdRefined'

type Stats = {
  listedCount: number
  listedValue: number | bigint
  totalCollected: number
}

const props = defineProps<{
  userId?: string
  profileData?: Profile
  followersCount?: number
  followingCount?: number
}>()

const { $consola } = useNuxtApp()
const route = useRoute()
const { client, urlPrefix } = usePrefix()

const emit = defineEmits(['click-followers', 'click-following'])

const id = computed(() => props?.userId || route.params.id || '')

const stats = ref<Stats>({
  listedCount: 0,
  listedValue: 0,
  totalCollected: 0,
})

const totalHoldingsNfts = computed(() => stats.value.totalCollected)
const listedCount = computed(() => stats.value.listedCount)

const statsRows = computed(() => [
  {
    label: 'activity.listed',
    value: `${listedCount.value}/${totalHoldingsNfts.value}`,
  },
  {
    label: 'activity.estimatedValue',
    value: stats.value.listedValue,
    component: CommonTokenMoney,
  },
  {
    label: 'activity.followers',
    value: props.followersCount ?? '-',
    onClick: () => emit('click-followers'),
  },
  {
    label: 'activity.following',
    value: props.followingCount ?? '-',
    onClick: () => emit('click-following'),
  },
])

useLazyAsyncData('stats', async () => {
  if (!id.value) {
    $consola.warn('ProfilActivity: id is not defined')
    return
  }

  const query = await resolveQueryPath(client.value, 'profileStatsByIdRefined')
  const { data } = await useAsyncQuery<ProfileStatsByIdRefined>({
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

  const listEvents = data.value.listed
    .filter((nft) => nft.events.length > 0)
    .map((nft) => nft.events[0])

  stats.value = {
    listedCount: listEvents.length,
    listedValue: getSumOfObjectField(listEvents, 'meta'),
    totalCollected: data.value?.obtained.totalCount,
  }
})
</script>
