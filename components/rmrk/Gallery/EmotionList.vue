<template>
  <div
    v-show="emotes"
    class="columns is-mobile is-multiline is-gapless nft-emotion__main"
  >
    <div
      v-for="emoji in emotes"
      :key="emoji.key"
      class="column nft-emotion__column"
    >
      <b-tag id="emoji-box" type="is-dark is-large">
        {{ String.fromCodePoint(parseInt(emoji.key, 16)) }}
        <span class="nft-emotion-tag__count">{{ emoji.count }}</span>
      </b-tag>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { Emotion } from '../service/scheme';

const issuerId = (emotion: Emotion) => emotion.issuer;

interface GroupedEmotion {
  [x: string]: Emotion[];
}

interface Emoji {
  key: string;
  count: number;
  issuers: string[];
}

@Component
export default class EmotionList extends Vue {
  @Prop() public emotions!: GroupedEmotion;

  get emotes(): Emoji[] {
    return Object.entries(this.emotions).map(([key, emotions]) => ({
      key,
      count: emotions.length,
      issuers: emotions.map(issuerId),
    }));
  }
}
</script>

<style lang="scss">
@import '@/styles/variables';

.nft-emotion__main {
  margin-top: 1em;
}

.nft-emotion-tag__count {
  margin-left: 0.2rem;
}

.nft-emotion__image {
  width: 25px;
}

#emoji-box {
  margin-bottom: 1rem;
  border: 2px solid $primary;
}
</style>
