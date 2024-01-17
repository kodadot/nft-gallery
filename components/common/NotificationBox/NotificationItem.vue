<template>
  <nuxt-link
    :to="`/${urlPrefix}/gallery/${event.nft.id}`"
    class="flex py-3 px-6 notify-item">
    <img
      v-if="avatar"
      :src="avatar"
      :alt="displayName"
      class="border object-cover image is-48x48" />
    <img
      v-else
      :src="placeholder"
      :alt="displayName"
      class="border object-cover image is-48x48" />
    <div class="flex-1 overflow-visible ml-5 flex flex-col">
      <div class="flex justify-between">
        <NeoTooltip :label="displayName" :delay="1000" class="w-0 flex-1 mr-4">
          <div class="is-ellipsis max-w-[8rem] has-text-weight-bold">
            {{ displayName }}
          </div>
        </NeoTooltip>
        <div class="overflow-auto is-ellipsis">
          <Money :value="event.meta" />
        </div>
      </div>
      <div class="flex justify-between">
        <div>
          <div class="height-50px flex items-center">
            <div
              class="leading-3 whitespace-nowrap rounded-[2rem] mr-4 border text-xs justify-center py-1 flex items-center"
              :class="[
                getInteractionColor(event.interaction),
                event.interaction === Interaction.ACCEPTED_OFFER
                  ? 'px-2'
                  : 'px-4',
              ]">
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
import { NeoTooltip } from '@kodadot1/brick'
import {
  Interaction,
  getInteractionColor,
  getInteractionName,
} from './useNotification'
import { InteractionWithNFT } from '@/composables/collectionActivity/types'
import Money from '@/components/shared/format/ChainMoney.vue'
import { formatToNow } from '@/utils/format/time'
import { getNFTAvatar } from '@/components/collection/activity/events/eventRow/common'

const { urlPrefix } = usePrefix()
const { placeholder } = useTheme()
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
      props.event as unknown as InteractionWithNFT,
    )
  }
}
const displayName = computed(
  () => props.event.nft.meta.name || props.event.nft.id,
)
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.notify-item {
  &:hover {
    @include ktheme() {
      color: theme('text-color');
      background-color: theme('k-accentlight2');
    }
  }
}
</style>
