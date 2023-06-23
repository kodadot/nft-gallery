<template>
  <div
    class="tag-container is-flex border py-1 px-2 is-justify-content-space-between is-align-items-center">
    <div class="icon-box">
      <img v-if="isMintingLive" :src="unlockablePulse" />
      <NeoIcon
        v-else
        icon="calendar-day"
        pack="far"
        variant="k-grey"
        class="mr-2" />
    </div>

    <span class="pr-1">{{ displayText }}</span>
  </div>
</template>

<script lang="ts" setup>
import unlockablePulse from '@/assets/unlockable-pulse.svg'
import { NeoIcon } from '@kodadot1/brick'
const { $i18n } = useNuxtApp()
const props = defineProps<{
  dropStartTime: Date
}>()

const isMintingLive = computed(() => {
  const now = new Date()
  return props.dropStartTime <= now
})

const displayText = computed(() => {
  if (isMintingLive.value) {
    return $i18n.t('drops.mintingLive')
  } else {
    const options = {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    } as any
    return props.dropStartTime.toLocaleString($i18n.locale, options)
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables.scss';

.icon-box {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tag-container {
  border-radius: 2rem;
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
