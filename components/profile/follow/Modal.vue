<template>
  <NeoModal :value="vOpen" @close="close">
    <ModalBody content-class="px-6 py-5" @close="close">
      <template #header>
        <div class="flex">
          <TabItem
            v-for="tab in tabs"
            :key="tab"
            :active="activeTab === tab"
            :text="tab"
            :count="counts[tab]"
            :show-active-check="false"
            class="capitalize !w-36"
            full-width
            no-shadow
            @click="() => switchToTab(tab)" />
        </div>
      </template>

      <tamplate>
        <ProfileFollowTab
          v-if="activeTab === 'followers'"
          type="followers"
          :user-list="followersList"
          :total-count="followersCount" />
        <ProfileFollowTab
          v-else
          type="following"
          :user-list="followingList"
          :total-count="followingCount" />
      </tamplate>
    </ModalBody>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoModal } from '@kodadot1/brick'
import TabItem from '@/components/shared/TabItem.vue'
import { Follower } from '@/services/profile'
import { Tab } from '@/components/profile/types'

const emit = defineEmits(['close'])

const props = defineProps<{
  modelValue: boolean
  initialTab: Tab
  followersCount: number
  followingCount: number
}>()

const tabs: Tab[] = ['followers', 'following']
const counts = {
  followers: props.followersCount,
  following: props.followingCount,
}

const followersList = ref<Follower[]>([])
const followingList = ref<Follower[]>([])

const activeTab = ref<Tab>('followers')

const vOpen = useVModel(props, 'modelValue')

const switchToTab = (tab) => {
  activeTab.value = tab
}

const close = () => {
  vOpen.value = false
  emit('close')
}

onBeforeUnmount(close)

watchEffect(() => {
  activeTab.value = props.initialTab
})
</script>
