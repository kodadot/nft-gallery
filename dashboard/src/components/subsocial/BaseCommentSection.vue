<template>
  <div>
    <p class="title is-size-4">{{ $t('subsocial.comments') }}</p>
    <p v-if="!accountId" class="subtitle is-size-6">{{ $t('subsocial.logIn') }}</p>
    <template v-else >
      <p class="subtitle is-6" v-if="this.balance && !actionDisabled">
        {{ $t("subsocial.balance") }}: {{ this.balance }}
      </p>
      <FaucetLink v-else />
      <BasePostReply v-if="postId && this.balance && !actionDisabled" />
    </template>
    <CreatePost v-if="!postId && accountId && !actionDisabled" :nft="nft" :meta="meta" />
    <CommentWrapper  v-if="postId" :postId="postId" />
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { resolveSubsocialApi } from './api';
import shouldUpdate from '@/utils/shouldUpdate';
import { emptyObject } from '@/utils/empty';
import { NFT, NFTMetadata } from '../rmrk/service/scheme';
import { searchPost } from '@/proxy';
import { SUBSOCIAL_KODA_SPACE, subSocialStore } from './utils';
import { setMany, get } from 'idb-keyval';

const components = {
  CommentWrapper: () => import('./CommentWrapper.vue'),
  BasePostReply: () => import('./Reply.vue'),
  FaucetLink: () => import('./FaucetLink.vue'),
  CreatePost: () => import('./CreatePost.vue')
};

type ElasticResult = {
  _id: string;
  _source: {
    spaceId: string;
    title: string;
  }
}

@Component({
  name: 'BaseCommentSection',
  components
})
export default class BaseCommentSection extends Vue {
  @Prop({ default: () => emptyObject<NFT>() }) public nft!: NFT;
  @Prop({ default: () => emptyObject<NFTMetadata>() }) public meta!: NFTMetadata;
  protected postId: string = '';
  protected actionDisabled: boolean = false;
  protected balance: string = '';

  get accountId() {
    return this.$store.getters.getAuthAddress;
  }

  get nftId() {
    return this.nft.name
  }

  protected async checkIfPoor(address: string) {
    const ss = await resolveSubsocialApi();
    const api = await ss.substrate.api;
    (window as any).SS = ss;
    const balance = await api.derive.balances.all(address);
    this.actionDisabled = balance.freeBalance.ltn(0.05);
    this.balance = balance.freeBalance?.toHuman();
    console.log('balance', balance.freeBalance?.toHuman());
  }

  protected async searchForPost(name: string = 'Something is in KodaDot kitchen') {
    const cache = await get(name, subSocialStore);

    if (cache) {
      this.postId = cache;
      return;
    }

    const ss = await resolveSubsocialApi();
    const posts = (await ss.substrate.postIdsBySpaceId(SUBSOCIAL_KODA_SPACE as any)).map(e => e.toNumber())
    const p = await ss.findPublicPosts([...posts as any])
    const toStore: [string, string][] = p.map(e => ([e.content?.title || '', e.struct.id.toString()]))
    await setMany(toStore, subSocialStore)

    const x = await get(name, subSocialStore)

    this.postId = x || ''

    // const res: ElasticResult[] = await searchPost(encodeURI(name))
    // const found = res.find(e => e._source.title === name && e._source.spaceId === String(SUBSOCIAL_KODA_SPACE))
    // this.postId = found?._id || '';
  }

  @Watch('accountId', { immediate: true })
  protected onAccountChange(val: string, oldVal: string) {
    if (shouldUpdate(val, oldVal)) {
      this.checkIfPoor(val);
    }
  }

  @Watch('nftId', { immediate: true })
  protected onNftId(val: string, oldVal: string) {
    if (shouldUpdate(val, oldVal)) {
      this.searchForPost(val);
    }
  }

}
</script>
