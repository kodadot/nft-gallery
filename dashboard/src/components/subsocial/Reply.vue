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
  PostExtension
} from '@subsocial/types/substrate/classes';
import { PostId, SpaceId } from '@subsocial/types/substrate/interfaces';
import BN from 'bn.js';

@Component({})
export default class Reply extends Vue {
  protected message: string = '';
  @Prop({ default: '' }) public postId!: PostId;
  @Prop() public extension!: Comment | null;

  get accountId() {
    return this.$store.getters.getAuthAddress;
  }

  protected buildParams() {
    const { postId: parentId, extension: comment } = this;
    const commentExt = comment
      ? new Comment({
          parent_id: new OptionId(parentId),
          root_post_id: comment.root_post_id
        })
      : new Comment({ parent_id: new OptionId(), root_post_id: parentId });

    const newExtension = new PostExtension({ Comment: commentExt });

    return [
      new OptionId(),
      newExtension,
      new Content({ Raw: this.message as any })
    ];
  }

  protected async addComment() {
    const ss = await resolveSubsocialApi();
    if (!this.postId) {
      showNotification('No postId for Item!', notificationTypes.warn);
      return;
    }

    const args = this.buildParams()
    console.log(args)

    try {
      showNotification('Dispatched');
      const cb = (await ss.substrate.api).tx.posts.createPost;
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
