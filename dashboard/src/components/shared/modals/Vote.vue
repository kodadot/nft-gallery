<template>
  <ModalWrapper label="Vote" icon="plus">
    <div>
      <h3>#{{ referendumId.toString() }}</h3>
      <Dropdown mode="accounts" @selected="handleAccountSelection" />
      <VoteDropdown @selected="handler" />
      <Conviction @selected="handler" />
      <Balance
        :argument="{ name: 'balance', type: 'balance' }"
        @selected="handleValue"
      />
      <b-field label="password 🤫 magic spell" class="password-wrapper">
        <b-input v-model="password" type="password" password-reveal> </b-input>
      </b-field>

      <b-button
        type="is-primary"
        icon-left="paper-plane"
        outlined
        :disabled="!account || !password || isVoteEmpty() || !referendumId"
        @click="shipIt"
      >
        Submit
      </b-button>
      <b-button
        v-if="tx"
        tag="a"
        :href="getExplorerUrl(tx)"
        icon-left="external-link-alt"
      >
        View {{ tx.slice(0, 10) }}
      </b-button>
    </div>
  </ModalWrapper>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import ModalWrapper from './ModalWrapper.vue';
import Dropdown from '@/components/shared/Dropdown.vue';
import { KeyringPair } from '@polkadot/keyring/types';
import VoteDropdown from '@/components/democracy/VoteDropdown.vue';
import Conviction from '@/components/democracy/Conviction.vue';
import keyring from '@polkadot/ui-keyring';
import { notificationTypes, showNotification } from '@/utils/notification';
import exec from '@/utils/transactionExecutor';
import ViewTransaction from '../ViewTransaction.vue';
import Notif from '@/utils/vueNotification';
import Balance from '@/params/components/Balance.vue';
import { urlBuilderTransaction } from '@/utils/explorerGuide';

@Component({
  components: {
    ModalWrapper,
    Dropdown,
    VoteDropdown,
    Conviction,
    ViewTransaction,
    Balance
  },
})
export default class Vote extends Vue {

  @Prop() public referendumId!: any;
  private account: any = {};
  private password: string = '';
  private tx: string = '';
  private balance = 0;

  private vote: any = {
    aye: null,
    conviction: null,
  };

  getExplorerUrl(value: string) {
    return urlBuilderTransaction(value, 
      this.$store.state.explorer.chain, 
      this.$store.state.explorer.provider)
  }

  public handleAccountSelection(account: KeyringPair) {
    this.account = account;
  }

  public handler(vote: any) {
    this.vote = { ...this.vote, ...vote };
    console.warn(this.vote);

  }

  public async shipIt() {
    const { api } = (this as any).$http;

    if (!api) {
      return;
    }

    try {
      Notif.info('Dispatched vote');
      const { referendumId, vote, balance } = this;
      const { aye, conviction } = vote;
      this.tx = await exec(this.account, this.password, api.tx.democracy.vote, [referendumId, { Standard: { balance, vote: { aye, conviction } } }]);
      Notif.success(`Success TX: ${this.tx}`, notificationTypes.success);
    } catch (e) {
      console.error(e)
      Notif.error(e, notificationTypes.danger);
    }

  }

  private isVoteEmpty() {
    return this.vote.aye === null || this.vote.conviction === null;
  }

  private handleValue(value: any) {
    Object.keys(value).map((item) => {
      (this as any)[item] = value[item];
    });
  }

}
</script>
