<template>
  <div v-show="emotes" class="buttons mb-2">
    <NeoButton
      v-for="emoji in emotes.slice(0, DISPLAYED_EMOJI)"
      :key="emoji.key"
      variant="secondary"
      no-shadow
      class="emoji-box mb-2"
      @click.native="$emit('selected', emoji.parsed)">
      <NeoTooltip>
        {{ emoji.parsed }}
        <span class="ml-1">{{ emoji.count }}</span>
        <template #content>
          <div v-for="issuer in emoji.issuers" :key="issuer">
            <Identity :address="issuer" />
          </div>
        </template>
      </NeoTooltip>
    </NeoButton>

    <NeoButton
      v-if="emotes.length > 0"
      class="emoji-box mb-2"
      no-shadow
      @click.native="openEmotionModal()">
      <NeoIcon icon="info-circle" />
    </NeoButton>
  </div>
</template>

<script lang="ts" setup>
import orderBy from 'lodash/orderBy'

import { Emotion } from '../service/scheme'
import EmotionModal from './EmotionModal.vue'
import { NeoButton, NeoIcon, NeoTooltip } from '@kodadot1/brick'
import Identity from '@/components/identity/IdentityIndex.vue'

const issuerId = (emotion: Emotion) => emotion.caller
const DISPLAYED_EMOJI = 5
const { $neoModal } = useNuxtApp()
const instance = getCurrentInstance()

const props = defineProps<{
  emotions: []
}>()

/**
 * parse emoji from codepoint to emoji
 * @param codepoint Emoji Codepoint
 * @returns Emoticon 👨🏻‍🌾
 */
const parseEmoji = (codepoint): string => {
  if (codepoint) {
    const toInt = codepoint.split('-').map((code) => parseInt(code, 16))
    return String.fromCodePoint.apply(String, toInt)
  }

  return ''
}

const openEmotionModal = () => {
  $neoModal.open({
    parent: instance?.proxy,
    component: EmotionModal,
    canCancel: ['escape', 'outside'],
    hasModalCard: true,
    props: {
      emotes: emotes.value,
    },
  })
}

const emotes = computed(() => {
  const mapping = Object.entries(props.emotions).map(([key, emotions]) => ({
    key,
    count: emotions.length,
    issuers: emotions.map(issuerId),
    parsed: parseEmoji(key),
  }))
  const orderByCount = orderBy(mapping, ['count'], ['desc'])

  return orderByCount
})
</script>

<style lang="scss">
@import '@/styles/abstracts/variables';

.emoji-box {
  padding: 0 0.75rem;
  font-size: 1.25rem;
  height: 2em;
  border: 0 !important;
  border-top: 2px solid $primary !important;
}
</style>
