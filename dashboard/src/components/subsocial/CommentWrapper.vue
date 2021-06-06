<template>
  <div>
    <b-button v-if="!commentsVisible && !nested" type="is-link is-light" @click="commentsVisible = true" >{{ $t('subscan.showComments') }} {{ comments.length }}</b-button>
    <template v-else>
      <CommentAdapter v-for="(comment, i) in comments" :key="i" :comment="comment"/>
    </template>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { resolveSubsocialApi, subsocial } from './api'
import { PostType } from './types'
import BN from 'bn.js';
import { findCommentsForPost } from './utils'

const components = {
  CommentAdapter: () => import('./CommentAdapter.vue')
}

@Component({
  name: 'CommentWrapper',
  components
})
export default class CommentWrapper extends Vue {
  @Prop() public postId!: string;
  @Prop(Boolean) public nested!: boolean;
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
