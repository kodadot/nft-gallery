<template>
  <div
    class="tag-container is-flex border py-1 px-2 is-justify-content-space-between is-align-items-center">
    <div v-if="!ended" class="image is-24x24 has-text-centered">
      <img v-if="isMintingLive" src="/drop/unlockable-pulse.svg" />
      <NeoIcon v-else icon="calendar-day" variant="k-grey" />
    </div>
    {{ displayText }}
  </div>
</template>

<script lang="ts" setup>
import { NeoIcon } from '@kodadot1/brick'
const { $i18n } = useNuxtApp()
const props = defineProps<{
  dropStartTime: Date
  ended: boolean
}>()

const isMintingLive = computed(() => {
  const now = new Date()
  return props.dropStartTime <= now
})

const displayText = computed(() => {
  if (props.ended) {
    return $i18n.t('drops.mintingEnded')
  } else if (isMintingLive.value) {
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
@import '@/assets/styles/abstracts/variables.scss';
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
