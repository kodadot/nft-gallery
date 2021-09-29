<template>
  <div class="box">
    <Loader v-model="isLoading" :status="status" />
    <b-field :label="$i18n.t('subsocial.addComment')">
      <b-input v-model="message" type="textarea"></b-input>
    </b-field>
    <b-button
      :disabled="!message"
      type="is-primary"
      @click="addComment"
      icon-left="plus"
      outlined
      >{{ $t("subsocial.addComment") }}</b-button
    >
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator'
import { resolveSubsocialApi } from './api'
import exec, { execResultValue, txCb } from '@/utils/transactionExecutor'
import {
	notificationTypes,
	showNotification,
	infiniteNotif
} from '@/utils/notification'
import { subsocialAddress } from './utils'
import { Comment } from '@subsocial/types/substrate/classes'
import { PostId } from '@subsocial/types/substrate/interfaces'
import { pinSubSocialPost } from '@/proxy'
import TransactionMixin from '@/utils/mixins/txMixin'

@Component({
	components: {
		Loader: () => import('@/components/shared/Loader.vue')
	}
})
export default class Reply extends Mixins(TransactionMixin) {
  protected message = '';
  @Prop(String) public postId!: string;
  @Prop() public extension!: Comment | null;

  public async mounted() {
  	const ss = await resolveSubsocialApi()
  	const api = await ss.substrate.api
  	const cb = api.tx.posts.createPost;
  	(window as any).post = cb;
  	(window as any).ipfs = ss.ipfs
  }

  get accountId() {
  	return this.$store.getters.getAuthAddress
  }

  protected async buildParams() {
  	const { postId: parentId, extension: comment } = this
  	const commentExt = comment
  		? {
  			parent_id: parentId,
  			root_post_id: comment.root_post_id
  		}
  		: { parent_id: null, root_post_id: parentId }

  	const newExtension = { Comment: commentExt }
  	const cid = await pinSubSocialPost({ body: this.message })

  	return [null, newExtension, { IPFS: cid }]
  }

  protected async addComment() {
  	const ss = await resolveSubsocialApi()
  	if (!this.postId) {
  		showNotification('No postId for Item!', notificationTypes.warn)
  		return
  	}

  	const notif = infiniteNotif(`[SUBSOCIAL] Commenting post ${this.postId}`)

  	try {
  		const args = await this.buildParams()
  		this.initTransactionLoader()
  		showNotification('Dispatched')
  		const api = await ss.substrate.api
  		const cb = api.tx.posts.createPost
  		const tx = await exec(
  			subsocialAddress(this.accountId),
  			'',
        cb as any,
        args,
        txCb(
        	() => null,
        	err => {
        		execResultValue(tx)
        		showNotification(`[ERR] ${err.hash}`, notificationTypes.danger)
        		notif.close()
        		this.isLoading = false
        	},
        	res => {
        		if (res.status.isInBlock) {
        			execResultValue(tx)
        			showNotification(
        				res.status.asInBlock.toString(),
        				notificationTypes.info
        			)
        			showNotification(
        				`[SUBSOCIAL] ${this.postId}`,
        				notificationTypes.success
        			)
        			this.isLoading = false
        			notif.close()
        			this.$emit('submit')
        		}
        	}
        )
  		)
  	} catch (e: any) {
  		console.error(
  			`[SUBSOCIAL] Unable to reply ${this.postId} with reaction ${this.message},\nREASON: ${e}`
  		)
  		showNotification(e.message, notificationTypes.danger)
  		this.isLoading = false
  		notif.close()
  	}
  }
}
</script>
