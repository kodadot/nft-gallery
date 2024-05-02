<template>
  <div v-if="totalCount > 0" ref="el" class="flex flex-col gap-5">
    <UserRow v-for="user in vList" :key="user.address" :user="user" />
  </div>
  <div v-else class="text-center text-k-grey">
    <span>Not Following Anyone Yet</span>
  </div>
</template>

<script setup lang="ts">
import { useInfiniteScroll } from '@vueuse/core'
import UserRow from '@/components/profile/follow/UserRow.vue'

import { Follower, fetchFollowersOf, fetchFollowing } from '@/services/profile'
import { Tab } from '../types'

const route = useRoute()

const props = defineProps<{
  totalCount: number
  userList: Follower[]
  type: Tab
}>()

const vList = useVModel(props, 'userList')
const offset = computed(() => vList.value.length)
const limit = 10
const el = ref<HTMLElement | null>(null)

const fetchNextPage = async () => {
  if (offset.value >= props.totalCount) {
    return
  }

  if (props.type === 'following') {
    const { following } = await fetchFollowing(
      route.params.id as string,
      limit,
      offset.value,
    )
    vList.value.push(...following)
  } else {
    const { followers } = await fetchFollowersOf(
      route.params.id as string,
      limit,
      offset.value,
    )
    vList.value.push(...followers)
  }
}

onMounted(() => {
  if (props.totalCount > 0) {
    fetchNextPage()
  }
})

useInfiniteScroll(el, fetchNextPage, { distance: limit })
</script>
