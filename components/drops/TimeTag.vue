<template>
  <div
    class="tag-container rounded-[2rem] flex border py-1 px-2 justify-between items-center">
    <div v-if="showIcon" class="image is-24x24 text-center">
      <img v-if="isMintingLive" src="/drop/unlockable-pulse.svg" />
      <NeoIcon v-else icon="calendar-day" variant="k-grey" />
    </div>
    <span
      v-if="isLessThan24Hours && !isMintingLive"
      class="text-k-grey mr-2 capitalize"
      >{{ $t('opensIn') }}</span
    >
    <span>{{ displayText }}</span>
  </div>
</template>

<script lang="ts" setup>
import { NeoIcon } from '@kodadot1/brick'
import { formatDuration, intervalToDuration } from 'date-fns'

const ONE_DAYH_IN_MS = 24 * 60 * 60 * 1000

const { $i18n } = useNuxtApp()
const now = useNow()
const props = defineProps<{
  dropStartTime: Date
  ended: boolean
  disabled: boolean
}>()

const showIcon = computed(() => !props.ended && isMintingLive.value)

const isMintingLive = computed(() => props.dropStartTime <= now.value)

const isLessThan24Hours = computed(
  () => now.value.valueOf() - props.dropStartTime.valueOf() <= ONE_DAYH_IN_MS,
)

const displayText = computed(() => {
  if (props.ended) {
    return $i18n.t('drops.mintingEnded')
  } else if (isMintingLive.value) {
    return $i18n.t(props.disabled ? 'drops.comingSoon' : 'drops.mintingLive')
  } else if (isLessThan24Hours.value) {
    const duration = intervalToDuration({
      start: props.dropStartTime,
      end: now.value,
    })
    return formatDuration(duration, {
      delimiter: ', ',
      format: ['hours', 'minutes'],
    })
  } else {
    const options = {
      day: '2-digit',
      month: '2-digit',
      hour: false,
      minute: false,
      hour12: false,
    } as any
    return props.dropStartTime.toLocaleString($i18n.locale, options)
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
