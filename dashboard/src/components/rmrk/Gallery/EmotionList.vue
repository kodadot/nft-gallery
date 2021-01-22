<template>
  <div class="columns is-multiline is-gapless nft-emotion__main">
    <div
      class="column is-3 nft-emotion__column"
      v-for="emoji in emojis"
      :key="emoji.key"
    >
      <b-taglist attached>
        <b-tag type="is-dark is-large">
          <b-image
            class="nft-emotion__image"
            :src="require(`@/components/rmrk/emoji/${emoji.key}.png`)"
            alt="Simple image"
            ratio="1by1"
            rounded
          ></b-image>
        </b-tag>
        <b-tag type="is-primary is-large">{{ emoji.count }}</b-tag>
      </b-taglist>
    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
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
export default class extends Vue {
  private value2: any;
  @Prop() public emotions!: GroupedEmotion;

  get emojis(): Emoji[] {
    return Object.entries(this.emotions).map(([key, emotions]) => ({
      key,
      count: emotions.length,
      issuers: emotions.map(issuerId)
    }));
  }
}
</script>

<style scoped>
.nft-emotion__main {
  margin-top: 1em;
}

.nft-emotion__image {
  width: 25px;
}
</style>
