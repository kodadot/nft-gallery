<template>
  <div
    class="tag-container rounded-[2rem] flex border py-1 px-2 justify-between items-center">
    <div
      v-if="showIcon"
      class="image is-24x24 text-center flex items-center justify-center">
      <span v-if="isMintingLive" class="relative flex h-3 w-3">
        <span
          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-k-primary opacity-75"></span>
        <span
          class="relative inline-flex rounded-full h-3 w-3 bg-k-primary"></span>
      </span>
      <NeoIcon v-else icon="calendar-day" variant="k-grey" />
    </div>
    <span
      v-if="isInLessThan24Hours && !isMintingLive"
      class="text-k-grey mr-2 capitalize"
      >{{ $t('opensIn') }}</span
    >
    <span>{{ displayText }}</span>
  </div>
</template>

<script lang="ts" setup>
import { NeoIcon } from '@kodadot1/brick'
import { formatDuration, intervalToDuration } from 'date-fns'
import { DropStatus } from './useDrops'

const { $i18n } = useNuxtApp()
const now = useNow()
const props = defineProps<{
  dropStartTime?: Date
  dropStatus: DropStatus
}>()

const isMintingLive = computed(
  () =>
    props.dropStatus === DropStatus.MINTING_LIVE ||
    props.dropStatus === DropStatus.COMING_SOON,
)
const isInLessThan24Hours = computed(
  () => props.dropStatus === DropStatus.SCHEDULED_SOON,
)
const showIcon = computed(
  () => props.dropStatus !== DropStatus.MINTING_ENDED && isMintingLive.value,
)

const displayText = computed(() => {
  switch (props.dropStatus) {
    case DropStatus.MINTING_ENDED:
      return $i18n.t('drops.mintingEnded')
    case DropStatus.COMING_SOON:
      return $i18n.t('drops.comingSoon')
    case DropStatus.MINTING_LIVE:
      return $i18n.t('drops.mintingLive')
    case DropStatus.SCHEDULED_SOON: {
      const duration = intervalToDuration({
        start: props.dropStartTime as Date,
        end: now.value,
      })
      return formatDuration(duration, {
        format: ['hours', 'minutes'],
      })
    }
    case DropStatus.SCHEDULED: {
      const options = {
        day: '2-digit',
        month: '2-digit',
        hour: false,
        minute: false,
        hour12: false,
      } as any
      return (props.dropStartTime as Date).toLocaleString($i18n.locale, options)
    }
    case DropStatus.UNSCHEDULED:
      return
    default:
      return ''
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables.scss';
.tag-container {
  @include ktheme() {
    border-color: theme('k-shade');
    background-color: theme('background-color');
    color: theme('text-color');
  }
}

@include until-widescreen {
  .unlockable-container {
    max-width: 100%;
  }
}
</style>
