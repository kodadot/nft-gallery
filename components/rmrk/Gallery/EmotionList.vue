<template>
  <div v-show="emotes" class="buttons mb-2">
    <b-button
      v-for="emoji in emotes"
      :key="emoji.key"
      type="is-outlined"
      class="emoji-box mb-2"
      @click="$emit('selected', emoji.parsed)">
      {{ emoji.parsed }}
      <span class="ml-1">{{ emoji.count }}</span>
    </b-button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import orderBy from 'lodash/orderBy'
import { Emotion } from '../service/scheme'

const issuerId = (emotion: Emotion) => emotion.caller

interface GroupedEmotion {
  [x: string]: Emotion[]
}

interface Emoji {
  key: string
  count: number
  issuers: string[]
  parsed: string
}

@Component
export default class EmotionList extends Vue {
  @Prop() public emotions!: GroupedEmotion

  /**
   * parse emoji from codepoint to emoji
   * @param codepoint Emoji Codepoint
   * @returns Emoticon 👨🏻‍🌾
   */
  parseEmoji(codepoint): string {
    if (codepoint) {
      const toInt = codepoint.split('-').map((code) => parseInt(code, 16))
      return String.fromCodePoint.apply(String, toInt)
    }

    return ''
  }

  get emotes(): Emoji[] {
    const mapping = Object.entries(this.emotions).map(([key, emotions]) => ({
      key,
      count: emotions.length,
      issuers: emotions.map(issuerId),
      parsed: this.parseEmoji(key),
    }))
    const orderByCount = orderBy(mapping, ['count'], ['desc'])

    return orderByCount
  }
}
</script>

<style lang="scss">
@import '@/styles/variables';

.emoji-box {
  padding: 0 0.75rem;
  font-size: 1.25rem;
  height: 2em;
  border: 0 !important;
  border-top: 2px solid $primary !important;
}
</style>
