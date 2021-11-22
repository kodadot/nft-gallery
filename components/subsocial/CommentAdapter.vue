<template>
  <div v-if="comment">
    <!-- <p>{{ postId }}</p> -->
    <Comment
      v-if="account"
      v-model="replyVisible"
      :message="message"
      :account="account"
      :post-id="postId"
      :upvotes="upvotes"
      :downvotes="downvotes"
      :action-disabled="actionDisabled"
      @change="refetch"
    />
    <Reply
      v-if="replyVisible"
      class="comment-adapter__nested"
      :post-id="postId"
      :space-id="spaceId"
      :extension="extension"
      @submit="reloadComments"
    />
    <CommentWrapper
      v-if="postId"
      class="comment-adapter__nested"
      :post-id="postId"
      nested
      :action-disabled="actionDisabled"
    />
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { PostType } from './types'

const components = {
  Comment: () => import('./Comment.vue'),
  CommentWrapper: () => import('./CommentWrapper.vue'),
  Reply: () => import('./Reply.vue'),
}

@Component({
  name: 'CommentAdapter',
  components
})
export default class CommentAdapter extends Vue {
  @Prop() public comment!: PostType
  @Prop(Number) public index!: number
  @Prop(Boolean) public actionDisabled!: boolean
  protected postId = ''
  protected replyVisible = false

  get message() {
    return this.comment?.content?.body
  }

  get account() {
    return this.commentStruct?.owner.toHuman()
  }

  get spaceId() {
    return this.commentStruct?.space_id.toHuman()
  }

  get canReply() {
    return this.replyVisible
  }

  get extension() {
    const extension = this.commentStruct?.extension
    return (extension?.isComment && extension?.asComment) || (extension as any).Comment
  }

  get commentStruct() {
    return this.comment?.struct
  }

  get upvotes() {
    return this.commentStruct?.upvotes_count.toNumber()
  }

  get downvotes() {
    return this.commentStruct?.downvotes_count.toNumber()
  }

  get replyCount() {
    return this.commentStruct?.replies_count.toNumber()
  }

  reloadComments() {
    this.replyVisible = false
    const post = this.postId
    this.postId = ''
    setTimeout(() => this.postId = post, 500)
  }

  refetch() {
    this.$emit('change', this.index)
  }

  public async mounted() {
    this.postId = this.comment?.struct.id.toString() || ''
  }

}
</script>

<style>
.comment-adapter__nested {
  margin-left: 2.5rem;
}

.box:last-child {
  margin-bottom: 1.5rem;
}
</style>
