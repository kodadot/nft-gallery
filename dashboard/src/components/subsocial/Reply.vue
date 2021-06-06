<template>
  <div class="box">
    <b-field :label="$i18n.t('subsocial.message.reply')">
      <b-input v-model="message" type="textarea"></b-input>
    </b-field>
    <b-button :disabled="!message" type="is-primary" @click="addComment" icon-left="plus" outlined
      >Add Comment</b-button
    >
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { resolveSubsocialApi } from './api';
import exec, { execResultValue } from '@/utils/transactionExecutor';
import { notificationTypes, showNotification } from '@/utils/notification';
import { subsocialAddress } from './utils';

@Component({})
export default class Reply extends Vue {
  protected message: string = '';
  @Prop({ default: '' }) public postId!: string;

  get accountId() {
    return this.$store.getters.getAuthAddress;
  }

  protected async addComment() {
    const ss = await resolveSubsocialApi();
    if (!this.postId) {
      showNotification('No postId for Item!', notificationTypes.warn);
      return;
    }

    try {
      showNotification('Dispatched');
      const cb = (await ss.substrate.api).tx.posts.createPost
      const arg = this.message
      const tx = await exec(subsocialAddress(this.accountId), '', cb as any, [this.postId, arg]);
      showNotification(execResultValue(tx), notificationTypes.success);

    } catch (e) {
      console.warn(`[SUBSOCIAL] Unable to react ${1} with reaction ${this.message},\nREASON: ${e}`)
      showNotification(e.message, notificationTypes.danger);
    }
  }
}
</script>
