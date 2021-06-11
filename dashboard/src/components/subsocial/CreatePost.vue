<template>
  <PostButton @click="handlePost" />
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'vue-property-decorator';
import { pinSubSocialPost } from '@/proxy';
import { emptyObject } from '@/utils/empty';
import { NFT, NFTMetadata } from '../rmrk/service/scheme';
import { extractCid } from '@/utils/ipfs';

const components = {
  PostButton: () => import('./PostButton.vue')
};

type Post = {
  title: string;
  body: string;
  image: string;
  tags: string[];
  canonical: string;
}

@Component({
  name: 'CreatePost',
  components
})
export default class CreatePost extends Vue {
  @Prop({ default: () => emptyObject<NFT>() }) public nft!: NFT;
  @Prop({ default: () => emptyObject<NFTMetadata>() }) public meta!: NFTMetadata;
  @Prop({ default: 'https://nft.kodadot.xyz/rmrk/detail/' }) public url!: string;


  protected async handlePost() {
    const { name, id } = this.nft
    const { image, attributes } = this.meta


    const post: Post = {
      title: name,
      image: extractCid(image),
      body: this.forceHackNftUrl(),
      tags: attributes.map(({ value }) => String(value)),
      canonical: `${this.url}${id}`
    }

    const newExtension = { RegularPost: null };
    const cid = await pinSubSocialPost(post);


    const args =  [
      3417,
      newExtension,
      { IPFS: cid }
    ];

    console.log(args)

  }

  // Subsocial does not show source so far
  protected forceHackNftUrl() {
    return `${this.meta.description}\n\n[View this NFT on KodaDot](${this.url})`
  }
}
</script>
