<template>
  <div>
    <template v-if="!commentsVisible && !nested">
      <b-button v-if="comments.length"  type="is-link is-light" @click="commentsVisible = true" >{{ $t('subsocial.showComments') }} {{ comments.length }}</b-button>
      <p class="subtitle is-6 has-text-primary">{{ $t('subsocial.noComment') }}</p>
    </template>
    <template v-else>
      <CommentAdapter v-for="(comment, i) in comments" :key="i" :comment="comment" />
    </template>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { resolveSubsocialApi, subsocial } from './api'
import { PostType } from './types'
import BN from 'bn.js';

const components = {
  CommentAdapter: () => import('./CommentAdapter.vue')
}

@Component({
  name: 'CommentWrapper',
  components
})
export default class CommentWrapper extends Vue {
  @Prop(String) public postId!: string;
  @Prop(Boolean) public nested!: boolean;
  @Prop(Boolean) public actionDisabled!: boolean;
  protected comments: PostType[] = [];
  protected commentsVisible: boolean = false;
  protected loading: boolean = false;

  public async mounted() {
    const ss = await resolveSubsocialApi();

    if (this.postId) {
      const commentIds = await ss.substrate.getReplyIdsByPostId(new BN(this.postId))
      const commentPromises =  commentIds.map(cm => ss.findPublicPost(cm))
      this.comments = await Promise.all(commentPromises)
      console.log(this.comments)
    }

  }
}
</script>
