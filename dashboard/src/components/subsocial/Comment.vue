<template>
  <div class="box">
    <article class="media">
      <div class="media-left">
        <figure class="image is-64x64">
          <img v-if="avatar" class="is-rounded" :src="avatar" @error="handleError">
          <Avatar v-else :value="account" :size="64" />
        </figure>
      </div>
      <div class="media-content">
        <div class="content">
          <p>
            <strong>
              <ProfileLink v-if="address" :address="address" :inline="true" />
              <Identity v-else :address="account" :inline="true"/>
            </strong>
            <template v-if="handle">
              <small class="comment-handle" >@{{ handle }}</small>
              <br />
            </template>
            {{ message }}
          </p>
        </div>
        <nav class="level is-mobile">
          <div class="level-left">
            <b-icon @click.native="handleLike" :class="{ 'comment-action__disabled': actionDisabled }" pack="far" icon="thumbs-up" size="is-small" class="level-item comment-action" />
            <span class="comment-action__number">{{ upvotes }}</span>
            <b-icon @click.native="handleDislike" :class="{ 'comment-action__disabled': actionDisabled }" pack="far" icon="thumbs-down" size="is-small" class="level-item comment-action" />
            <span class="comment-action__number">{{ downvotes }}</span>
            <b-icon v-if="!actionDisabled" @click.native="handleReplyVisibility" icon="reply" size="is-small" class="level-item comment-action"> </b-icon>
          </div>
        </nav>
      </div>
    </article>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
import { findProfile, subsocialAddress } from './utils';
import { ProfileContentType, ReactionType } from './types'
import { ipfsHashToUrl } from '@/components/rmrk/utils';
import { emptyObject } from '@/utils/empty';
import { formatAccount } from '@/utils/account';
import { resolveSubsocialApi } from './api';
import exec, { execResultValue, txCb } from '@/utils/transactionExecutor';
import { notificationTypes, showNotification } from '@/utils/notification';
import { ReactionKind } from '@subsocial/types/substrate/classes'
import TransactionMixin from '@/utils/mixins/txMixin';


const components = {
  Avatar: () => import('@/components/shared/Avatar.vue'),
  Identity: () => import('@/components/shared/format/Identity.vue'),
  ProfileLink: () => import('@/components/rmrk/Profile/ProfileLink.vue')
};

@Component({
  name: 'Comment',
  components
})
export default class Comment extends Mixins(TransactionMixin) {
  @Prop(Boolean) public value!: boolean;
  @Prop({ default: '' }) public message!: any;
  @Prop(String) public postId!: string;
  @Prop(String)
  public account!: string;
  @Prop(Number) public upvotes!: number;
  @Prop(Number) public downvotes!: number;
  @Prop(Boolean) public actionDisabled!: boolean;

  public profile: ProfileContentType = emptyObject<ProfileContentType>();

  get address() {
    return formatAccount(this.account)
  }

  get hasProfile() {
    return Object.keys(this.profile).length
  }

  get handle() {
    return this.profile.name
  }

  get avatar() {
    return ipfsHashToUrl(this.profile?.avatar)
  }

  get accountId() {
    return this.$store.getters.getAuthAddress;
  }

  public async mounted() {
    if (this.account) {
      const profile = await findProfile(this.account)
      console.log(profile, 'profile');
      if (profile) {
        this.profile = profile
      }
    }
  }

  protected handleError(a: any) {
    console.log('handleError', 'a', a)
  }


  protected handleReplyVisibility() {
    console.log(`this.$emit('input', !this.value)`, this.value);

    this.$emit('input', !this.value)
  }

  protected async handleLike() {
    this.submitReaction(ReactionType.Upvote)
    // try {
    //   const cb = (await ss.substrate.api).tx.posts.createPost

    // } catch (e)


  }

  protected handleDislike() {
    this.submitReaction(ReactionType.Downvote)
  }



  protected async submitReaction(reaction: ReactionType) {
    const ss = await resolveSubsocialApi();
    if (!this.postId) {
      showNotification('No postId for Item!', notificationTypes.warn);
      return
    }

    const arg = new ReactionKind()

    try {
      this.initTransactionLoader();
      showNotification('Dispatched');
      const api = await ss.substrate.api;
      const cb = api.tx.reactions.createPostReaction;

      const tx = await exec(subsocialAddress(this.accountId), '', cb as any, [this.postId, reaction],
      txCb(
          async blockHash => {
            execResultValue(tx);
            showNotification(blockHash.toString(), notificationTypes.info);

            showNotification(
              `[SUBSOCIAL] ${this.postId}`,
              notificationTypes.success
            );
            this.isLoading = false;
          },
          err => {
            execResultValue(tx);
            showNotification(`[ERR] ${err.hash}`, notificationTypes.danger);
            this.isLoading = false;
          },
          res => this.resolveStatus(res.status)
        ));


    } catch (e) {
      console.error(`[SUBSOCIAL] Unable to react ${arg} with reaction ${reaction},\nREASON: ${e}`)
      showNotification(e.message, notificationTypes.danger);
    } finally {
      this.isLoading = false;
    }
  }


}
</script>

<style lang="scss">
.comment-action:hover {
  color: #db2980;
  cursor: pointer;
}

.comment-action__number {
  margin-right: 0.75rem;
}

.comment-handle {
  padding-bottom: 0.75em;

}

.comment-action__disabled {
  pointer-events: none;
  &:hover {
    cursor: not-allowed;
  }
}
</style>
