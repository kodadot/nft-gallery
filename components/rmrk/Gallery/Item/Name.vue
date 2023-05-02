<template>
  <div v-if="detailVisible">
    <h1 class="title" :class="[detailVisible ? 'is-size-1' : 'is-size-3']">
      <span v-if="!isLoading">
        <span v-if="nft.burned">「🔥」</span>
        <span :class="{ 'has-text-info': nft.isFrozen }">{{ nft.name }}</span>
        <span v-if="carbonlessBadge">「🌱」</span>
      </span>
      <NeoSkeleton size="large" :active="isLoading"></NeoSkeleton>
    </h1>
    <p v-if="nft.isFrozen" class="title is-size-4 has-text-info">
      {{ $t('nft.frozen') }} 「❄️」
      <NeoSkeleton :count="1" size="large" :active="isLoading"></NeoSkeleton>
    </p>
    <p v-if="nft.burned" class="title is-size-4 has-text-danger">
      {{ $t('nft.burned') }} 「🔥」
      <NeoSkeleton :count="1" size="large" :active="isLoading"></NeoSkeleton>
    </p>
    <p v-if="carbonlessBadge" class="title is-size-4 has-text-success">
      {{ $t('nft.carbonless') }} 「🌱」
      <NeoSkeleton :count="1" size="large" :active="isLoading"></NeoSkeleton>
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import isShareMode from '@/utils/isShareMode'
import { NFTWithMeta } from '../../service/scheme'
import { emptyObject } from '@/utils/empty'
import { NeoSkeleton } from '@kodadot1/brick'

@Component({
  NeoSkeleton,
})
export default class Name extends Vue {
  @Prop({ default: () => emptyObject<NFTWithMeta>() }) public nft!: NFTWithMeta
  @Prop() public isLoading!: boolean

  get detailVisible() {
    return !isShareMode
  }

  get carbonlessBadge() {
    return this.nft.attributes?.some(
      ({ trait_type, value }) => trait_type === 'carbonless' && value
    )
  }
}
</script>
