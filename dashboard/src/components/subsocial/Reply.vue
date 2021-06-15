<template>
  <div class="box">
    <Loader v-model="isLoading" :status="status" />
    <b-field :label="$i18n.t('subsocial.reply')">
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
import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
import { resolveSubsocialApi } from './api';
import exec, { execResultValue, txCb } from '@/utils/transactionExecutor';
import { notificationTypes, showNotification } from '@/utils/notification';
import { subsocialAddress } from './utils';
import {
  Comment,
} from '@subsocial/types/substrate/classes';
import { PostId } from '@subsocial/types/substrate/interfaces';
import { pinSubSocialPost } from '@/proxy';
import TransactionMixin from '@/utils/mixins/txMixin';

@Component({
  components: {
    Loader: () => import('@/components/shared/Loader.vue')
  }
})
export default class Reply extends Mixins(TransactionMixin) {
  protected message: string = '';
  @Prop(String) public postId!: string;
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
      this.initTransactionLoader();
      showNotification('Dispatched');
      const api = await ss.substrate.api;
      const cb = api.tx.posts.createPost;
      const tx = await exec(subsocialAddress(this.accountId), '', cb as any, args,
      txCb(
          async blockHash => {
            execResultValue(tx);
            showNotification(blockHash.toString(), notificationTypes.info);

            showNotification(
              `[SUBSOCIAL] ${this.postId}`,
              notificationTypes.success
            );
            this.isLoading = false;
            this.$emit('submit');
          },
          err => {
            execResultValue(tx);
            showNotification(`[ERR] ${err.hash}`, notificationTypes.danger);
            this.isLoading = false;
          },
          res => this.resolveStatus(res.status)
        ));
    } catch (e) {
      console.error(
        `[SUBSOCIAL] Unable to reply ${this.postId} with reaction ${
          this.message
        },\nREASON: ${e}`
      );
      showNotification(e.message, notificationTypes.danger);

    } finally {
      this.isLoading = false;
    }
  }
}
</script>
