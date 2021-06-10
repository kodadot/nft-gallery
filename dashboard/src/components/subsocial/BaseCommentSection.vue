<template>
  <div>
    <template v-if="accountId">
      <FaucetLink />
      <p class="subtitle is-6 has-text-primary">{{ $t('subsocial.balance') }}: {{ this.balance }}</p>
      <BasePostReply />
    </template>

    <CommentWrapper postId="14659" />
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { resolveSubsocialApi } from './api';
import shouldUpdate from '@/utils/shouldUpdate';

const components = {
  CommentWrapper: () => import('./CommentWrapper.vue'),
  BasePostReply: () => import('./Reply.vue'),
  FaucetLink: () => import('./FaucetLink.vue')
}

@Component({
  name: 'BaseCommentSection',
  components
})
export default class BaseCommentSection extends Vue {
  @Prop(String) public postId!: string;
  protected actionDisabled: boolean = false;
  protected balance: string = '';

  get accountId() {
    return this.$store.getters.getAuthAddress;
  }

  public async mounted() {


    if (this.accountId) {
      await this.checkIfPoor(this.accountId)
    }
  }

  protected async checkIfPoor(address: string) {
    const ss = await resolveSubsocialApi();
    const api = await ss.substrate.api;
    (window as any).SS = ss.substrate
    const balance = await api.derive.balances.all(address)
    this.actionDisabled = balance.freeBalance.ltn(0.05)
    this.balance = balance.freeBalance?.toHuman()
    console.log('balance', balance.freeBalance?.toHuman())
  }

  @Watch('accountId')
  protected onAccountChange(val: string, oldVal: string) {
    if (shouldUpdate(val, oldVal)) {
      this.checkIfPoor(val)
    }
  }
}
</script>
