<template>
  <div>
    <b-tabs>
      <b-tab-item label="Extrinsic submission"></b-tab-item>
    </b-tabs>
    <Selection @selected="handleAccountSelection"/>
    <div class="executor-wrapper">
      <Executor
        :methods="sections"
        @selected="handleSectionSelection"
        label="submit the following extrinsic"
      />
      <Executor :methods="methods" @selected="handleMethodSelection" label="method" />
    </div>
    <Argurments :args="args" @selected="handleSelectedArguments" />
    <div class="transaction buttons">
      <b-button type="is-danger" outlined disabled>Submit unsigned</b-button>
      <b-button type="is-primary" @click="submitTx">Submit Transaction</b-button>
    </div>
  </div>
</template>

<script lang="ts">
import Selection from '../components/extrinsics/Selection.vue';
import Executor from '../components/extrinsics/Executor.vue';
import Argurments from '../components/extrinsics/Arguments.vue';
import { Prop, Vue, Component } from 'vue-property-decorator';
import { KeyringPair } from '@polkadot/keyring/types';

// import Connector from '@vue-polkadot/vue-api'
//
// const api = Connector.getInstance().api;
//
// if (api) {
//   const defaultSection = Object.keys(api.tx)[0];
// const defaultMethod = Object.keys(api.tx[defaultSection])[0];
// const apiDefaultTx = api.tx[defaultSection][defaultMethod];
// const apiDefaultTxSudo =
//         (api.tx.system && api.tx.system.setCode) || // 2.x
//         (api.tx.consensus && api.tx.consensus.setCode) || // 1.x
//         apiDefaultTx; // other
// }

@Component({
  components: {
    Selection,
    Executor,
    Argurments,
  },
})
export default class Extrinsics extends Vue {

  get sections() {
    return Object.keys((this as any).$http.api.tx);
  }

  get methods() {
    return this.fnSection
      ? Object.keys((this as any).$http.api.tx[this.fnSection])
      : [];
  }
  private isValid: boolean = false;
  private isValidUnsigned: boolean = false;
  private method = null;
  // private apiDefaultTxSudo = apiDefaultTxSudo;
  // private methods =
  private fnSection = '';
  private fnMethod = '';
  private args: any[] = [];
  private selectedArguments = {};
  private account: any;

  public handleSectionSelection(value: string) {
    this.fnSection = value;
  }

  public handleMethodSelection(value: string) {
    this.fnMethod = value;
    this.args = (this as any).$http.api.tx[this.fnSection][value].meta.args;
  }

  public handleSelectedArguments(value: any) {
    this.selectedArguments = {
      ...this.selectedArguments,
      ...value,
    };
  }

  public handleAccountSelection(account: KeyringPair) {
    console.log('account', account);

    this.account = account;
  }

// TODO: https://polkadot.js.org/api/examples/promise/06_make_transfer/
  public async submitTx() {
      const { api } = (this as any).$http;
      console.log('here', (api && this.account && this.fnMethod && this.fnSection));
      if (api && this.account && this.fnMethod && this.fnSection) {
        const args = this.args.map(this.argMapper);
        console.log(args);
        const func = api.tx[this.fnSection][this.fnMethod](...args);
        try {
          console.log('func is ', func);
          const hash = await func.signAndSend(this.account);
          console.log('Transfer sent with hash', hash.toHex());
        } catch (e) {
          console.warn('Err occ', e);

        }

      }
  }

  private argMapper(arg: any): any {
    const accessor: string = arg.name.toString();
    // @ts-ignore: Method has always value
    return this.selectedArguments[accessor];
  }

  // private getExtrinsic() {
  //   const { api } = (this as any).$http;
  //   const { method } = this;

  //   if (method) {
  //     // @ts-ignore: Method has always value
  //     const fn = api.findCall(method.callIndex);
  //     // @ts-ignore: Method has always value
  //     this.extrinsic = api.tx[fn.section][fn.method](...method.args);
  //   }
  // }
}
</script>

<style>
.executor-wrapper {
  display: flex;
}

.executor-wrapper > * {
  flex: 1;
}

.transaction.buttons {
  margin-top: 1em;
  float: right;
}
</style>
