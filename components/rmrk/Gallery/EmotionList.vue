<template>
  <div v-show="emotes" class="buttons mb-2">
    <b-button
      v-for="emoji in emotes"
      :key="emoji.key"
      type="is-outlined"
      class="emoji-box mb-2"
      @click="$emit('selected', emoji.key)">
      {{ String.fromCodePoint(parseInt(emoji.key, 16)) }}
      <span class="ml-1">{{ emoji.count }}</span>
    </b-button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Emotion } from '../service/scheme'

const issuerId = (emotion: Emotion) => emotion.issuer

interface GroupedEmotion {
  [x: string]: Emotion[]
}

interface Emoji {
  key: string
  count: number
  issuers: string[]
}

@Component
export default class EmotionList extends Vue {
  @Prop() public emotions!: GroupedEmotion

  get emotes(): Emoji[] {
    return Object.entries(this.emotions).map(([key, emotions]) => ({
      key,
      count: emotions.length,
      issuers: emotions.map(issuerId),
    }))
  }
}
</script>

<style lang="scss">
@import '@/styles/variables';

.emoji-box {
  padding: 0 0.75rem;
  font-size: 1.25rem;
  height: 2em;
  border: 0!important;
  border-top: 2px solid $primary!important;
}
</style>
