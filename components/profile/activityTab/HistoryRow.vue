<template>
  <div class="columns mb-2">
    <div class="column is-clipped">
      <div class="is-flex is-align-items-center">
        <nuxt-link
          :to="`/${urlPrefix}/gallery/${event.Item.id}`"
          class="height-50px">
          <NeoAvatar
            :avatar="avatar"
            :placeholder="placeholder"
            :name="event.Item.name"
            :size="50" />
        </nuxt-link>
        <nuxt-link
          class="is-ellipsis is-inline-block"
          :to="`/${urlPrefix}/gallery/${event.Item.id}`">
          <span class="ml-5 has-text-weight-bold is-clipped">
            {{ event.Item.name }}
          </span>
        </nuxt-link>
      </div>
    </div>

    <div class="column is-1">
      <div class="height-50px is-flex is-align-items-center">
        <div
          class="border is-size-7 is-justify-content-center py-1 my-2 is-flex is-align-items-center fixed-width fixed-height"
          :class="getInteractionColor(event.Type)">
          {{ $t(`nft.event.${event.Type}`) }}
        </div>
      </div>
    </div>

    <div class="column is-ellipsis">
      <div class="height-50px is-flex is-align-items-center">
        <div v-if="parseInt(event.Amount)">
          <CommonTokenMoney :value="event.Amount" />
        </div>
        <div v-else>{{ blank }}</div>
      </div>
    </div>

    <div class="column">
      <div class="height-50px is-flex is-align-items-center">
        <nuxt-link
          v-if="!!fromAddress"
          :to="`/${urlPrefix}/u/${fromAddress}`"
          class="has-text-link">
          <IdentityIndex ref="identity" :address="fromAddress" show-clipboard />
        </nuxt-link>
        <div v-else>
          {{ blank }}
        </div>
      </div>
    </div>

    <div v-if="withToColumn" class="column">
      <div class="height-50px is-flex is-align-items-center">
        <nuxt-link
          v-if="!!toAddress"
          :to="`/${urlPrefix}/u/${toAddress}`"
          class="has-text-link">
          <IdentityIndex ref="identity" :address="toAddress" show-clipboard />
        </nuxt-link>
        <div v-else>
          {{ blank }}
        </div>
      </div>
    </div>

    <div v-if="withToColumn" class="column">
      <div class="height-50px is-flex is-align-items-center">
        <span :class="percentageTextClassName(event.Percentage)">
          {{ toPercent(event.Percentage, blank) }}
        </span>
      </div>
    </div>

    <div class="column">
      <div class="height-50px is-flex is-align-items-center">
        <NeoTooltip :label="event.Date" position="left">
          <BlockExplorerLink :block-id="event.Block" :text="event.Time" />
        </NeoTooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoAvatar, NeoTooltip } from '@kodadot1/brick'
import { parseNftAvatar } from '@/utils/nft'
import { Event } from './History.vue'
import {
  blank,
  getInteractionColor,
} from '@/components/collection/activity/events/eventRow/common'
import BlockExplorerLink from '@/components/shared/BlockExplorerLink.vue'
import { toPercent } from '@/utils/filters'

const props = defineProps<{
  event: Event
  withToColumn: boolean
}>()

const { urlPrefix } = usePrefix()
const avatar = ref()
const { placeholder } = useTheme()

const fromAddress = computed(() => props.event.From)
const toAddress = computed(() => props.event.To)

onMounted(async () => {
  parseNftAvatar(props.event.Item).then((response) => (avatar.value = response))
})

const percentageTextClassName = (percentage: number) => {
  if (percentage > 0) {
    return 'has-text-success'
  } else if (percentage < 0) {
    return 'has-text-danger'
  }
  return ''
}
</script>

<style scoped>
.fixed-width {
  width: 66px;
}

.fixed-height {
  height: 22px;
}
.height-50px {
  height: 50px;
}
</style>
