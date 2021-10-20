<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <PostButton @click="handlePost" />
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { pinSubSocialPost } from '@/proxy'
import { emptyObject } from '@/utils/empty'
import { NFT, NFTMetadata } from '../rmrk/service/scheme'
import { extractCid } from '@/utils/ipfs'
import { SUBSOCIAL_KODA_SPACE, subsocialAddress } from './utils'
import TransactionMixin from '@/utils/mixins/txMixin'
import AuthMixin from '@/utils/mixins/authMixin'
import { resolveSubsocialApi } from './api'
import exec, { txCb, execResultValue } from '@/utils/transactionExecutor'
import { showNotification, notificationTypes } from '@/utils/notification'

const components = {
  Loader: () => import('@/components/shared/Loader.vue'),
  PostButton: () => import('./PostButton.vue')
}

type Post = {
  title: string;
  body: string;
  image: string;
  tags: string[];
  canonical: string;
};

@Component({
  name: 'CreatePost',
  components
})
export default class CreatePost extends Mixins(TransactionMixin, AuthMixin) {
  @Prop({ default: () => emptyObject<NFT>() }) public nft!: NFT;
  @Prop({ default: () => emptyObject<NFTMetadata>() })
  public meta!: NFTMetadata;
  @Prop({ default: 'https://nft.kodadot.xyz/rmrk/detail/' })
  public url!: string;

  protected async buildParams() {
    const { name, id } = this.nft
    const { image, attributes } = this.meta

    const post: Post = {
      title: name,
      image: extractCid(image),
      body: this.forceHackNftUrl(),
      tags: attributes.map(({ value }) => String(value)),
      canonical: `${this.url}${id}`
    }

    const newExtension = { RegularPost: null }
    const cid = await pinSubSocialPost(post)

    const args = [SUBSOCIAL_KODA_SPACE, newExtension, { IPFS: cid }]

    return args
  }

  protected async handlePost() {
    // try {
    //   this.initTransactionLoader()
    //   const ss = await resolveSubsocialApi()
    //   const args = await this.buildParams()
    //   const api = await ss.substrate.api
    //   const address = subsocialAddress(this.accountId)

    //   const isFollower = await ss.substrate.isSpaceFollower(address, SUBSOCIAL_KODA_SPACE as any)

    //   const cb = isFollower ? api.tx.posts.createPost : api.tx.utility.batch
    //   const finalArgs = isFollower ? args : [[api.tx.spaceFollows.followSpace(SUBSOCIAL_KODA_SPACE), api.tx.posts.createPost(...args)]]
    //   const tx = await exec(
    //     subsocialAddress(this.accountId),
    //     '',
    //     cb as any,
    //     finalArgs,
    //     txCb(
    //       () => null,
    //       err => {
    //         execResultValue(tx)
    //         showNotification(`[ERR] ${err.hash}`, notificationTypes.danger)
    //         this.isLoading = false
    //       },
    //       res => {
    //         this.resolveStatus(res.status)
    //         if (res.status.isInBlock) {
    //           execResultValue(tx)
    //           showNotification(
    //             res.status.asInBlock.toString(),
    //             notificationTypes.info
    //           )
    //           showNotification(
    //             `[SUBSOCIAL] ${this.nft.name}`,
    //             notificationTypes.success
    //           )
    //           this.$emit('input')
    //           this.isLoading = false
    //         }
    //       }
    //     )
    //   )
    // } catch (e: any) {
    //   showNotification(`[POST] ${e.message}`, notificationTypes.warn)
    // }
  }

  // Subsocial does not show source so far
  protected forceHackNftUrl() {
    return `${this.meta.description}\n\n[View this NFT on KodaDot](${this.url}${this.nft.id})`
  }
}
</script>
