<template>
  <nuxt-link
    :to="`/${urlPrefix}/gallery/${event.nft.id}`"
    class="is-flex notify-item">
    <img
      v-if="avatar"
      :src="avatar"
      :alt="event.nft.name"
      width="50"
      height="50"
      class="border image-size" />
    <img
      v-else
      src="/placeholder.webp"
      width="50"
      height="50"
      class="border image-size" />
    <div class="notify-content ml-5 is-flex is-flex-direction-column">
      <div class="is-flex is-justify-content-space-between">
        <div class="nft-name mr-4 has-text-weight-bold is-ellipsis">
          {{ event.nft.name || event.nft.id }}
        </div>
        <div class="nft-price is-ellipsis">
          <Money :value="event.nft.price" />
        </div>
      </div>
      <div class="is-flex is-justify-content-space-between">
        <div>
          <div class="height-50px is-flex is-align-items-center">
            <div
              class="event-type mr-4 border is-size-7 is-justify-content-center px-4 py-1 is-flex is-align-items-center"
              :class="getInteractionColor(event.interaction)">
              {{ getInteractionName(event.interaction) }}
            </div>
          </div>
        </div>
        <div class="is-ellipsis">
          {{ formatToNow(new Date(event.timestamp), false) }}
        </div>
      </div>
    </div>
  </nuxt-link>
</template>

<script setup lang="ts">
import { Event } from './types'
import { getInteractionColor, getInteractionName } from './useNotification'
import { InteractionWithNFT } from '@/composables/collectionActivity/types'
import Money from '@/components/shared/format/ChainMoney.vue'
import { formatToNow } from '@/utils/format/time'
import { getNFTAvatar } from '@/components/collection/activity/events/eventRow/common'
const { urlPrefix } = usePrefix()
const props = defineProps<{
  event: Event
}>()
const avatar = ref<string>()
onMounted(() => {
  getAvatar()
})
const getAvatar = async () => {
  if (props.event) {
    avatar.value = await getNFTAvatar(
      props.event as unknown as InteractionWithNFT
    )
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';

.notify-item {
  padding: 0.75rem 2rem;
  &:hover {
    @include ktheme() {
      color: theme('text-color');
      background-color: theme('k-accentlight2');
    }
  }
  img.image-size {
    height: 50px;
    width: 50px;
    object-fit: contain;
  }
}
.notify-content {
  flex: 1;
  overflow: auto;
}
.nft-price {
  overflow: auto;
}
.nft-name {
  width: 0;
  flex: 1;
}
.event-type {
  line-height: 0.75rem;
  border-radius: 2rem;
  white-space: nowrap;
}
</style>
