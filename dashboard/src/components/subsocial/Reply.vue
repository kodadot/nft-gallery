<template>
  <div class="box">
    <b-field :label="$i18n.t('subsocial.message.reply')">
      <b-input v-model="message" type="textarea"></b-input>
    </b-field>
    <b-button
      :disabled="!message"
      type="is-primary"
      @click="addComment"
      icon-left="plus"
      outlined
      >Add Comment</b-button
    >
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { resolveSubsocialApi } from './api';
import exec, { execResultValue, txCb } from '@/utils/transactionExecutor';
import { notificationTypes, showNotification } from '@/utils/notification';
import { subsocialAddress } from './utils';
import {
  Comment,
  OptionId,
  Content,
  ContentEnum,
  PostExtension,
  IpfsContent
} from '@subsocial/types/substrate/classes';
import { PostId } from '@subsocial/types/substrate/interfaces';
import { pinSubSocialPost } from '@/proxy';
import BN from 'bn.js'

@Component({})
export default class Reply extends Vue {
  protected message: string = '';
  @Prop({ default: '' }) public postId!: PostId;
  @Prop() public extension!: Comment | null;


  public async mounted() {
    const ss = await resolveSubsocialApi();
    const api = await ss.substrate.api;
    const cb = api.tx.posts.createPost;
    (window as any).post = cb;
    (window as any).ipfs = ss.ipfs;
  }

  get accountId() {
    return this.$store.getters.getAuthAddress;
  }

  protected async buildParams() {
    const { postId: parentId, extension: comment } = this;
    const commentExt = comment
      ? {
          parent_id: parentId,
          root_post_id: comment.root_post_id
        }
      : { parent_id: null, root_post_id: parentId };

    const newExtension = { Comment: commentExt };
    const cid = await pinSubSocialPost({ body: this.message });
    // const cid = 'QmZVJpQ54ZeJ9SEnM3MaXUeY86GvjU3SxTv2jkMYxJaRGQ'

    return [
      null,
      newExtension,
      { IPFS: cid }
    ];
  }

  protected async addComment() {
    const ss = await resolveSubsocialApi();
    if (!this.postId) {
      showNotification('No postId for Item!', notificationTypes.warn);
      return;
    }

    const args = await this.buildParams()
    console.log(args)

    try {
      showNotification('Dispatched');
      const api = await ss.substrate.api;
      const cb = api.tx.posts.createPost;
      const tx = await exec(subsocialAddress(this.accountId), '', cb as any, args);
      showNotification(execResultValue(tx), notificationTypes.success);
    } catch (e) {
      console.error(
        `[SUBSOCIAL] Unable to reply ${this.postId} with reaction ${
          this.message
        },\nREASON: ${e}`
      );
      showNotification(e.message, notificationTypes.danger);
    }
  }
}
</script>
