<template>
  <div>
    <div>Using {{ version }}</div>
    <div>
      Computed id: <b>{{ rmrkId }}</b>
    </div>
    <AccountSelect label="Account" v-model="accountId" />
    <b-field label="Name">
      <b-input v-model="rmrkMint.name"></b-input>
    </b-field>
    <b-field label="Maximum NFTs in collection">
      <b-numberinput
        v-model="rmrkMint.max"
        placeholder="MaxArts"
        :min="1"
      ></b-numberinput>
    </b-field>
    <b-field label="Symbol">
      <b-input v-model="rmrkMint.symbol"></b-input>
    </b-field>
    <b-switch v-model="uploadMode" passive-type="is-dark" type="is-info">
      {{ uploadMode ? 'Upload' : 'IPFS hash' }}
    </b-switch>
    <MetadataUpload v-if="uploadMode" @change="upload" />
    <b-field v-else label="Metadata IPFS Hash">
      <b-input v-model="rmrkMint.metadata"></b-input>
    </b-field>
    <b-button
      type="is-primary"
      icon-left="paper-plane"
      @click="submit"
      :disabled="disabled"
    >
      Submit
    </b-button>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { RmrkMint } from '../types';
import { emptyObject } from '@/utils/empty';
import AccountSelect from '@/components/shared/AccountSelect.vue';
import MetadataUpload from './MetadataUpload.vue';
import Connector from '@vue-polkadot/vue-api';
import exec from '@/utils/transactionExecutor';
import min from '@polkadot/util/bn/min';
import { getInstance, RmrkType } from '../service/RmrkService';

const components = {
  AccountSelect,
  MetadataUpload
};

@Component({ components })
export default class CreateCollection extends Vue {
  private version: string = 'RMRK0.1';
  private rmrkMint: RmrkMint = emptyObject<RmrkMint>();
  private accountId: string = '';
  private uploadMode: boolean = true;

  get rmrkId(): string {
    return String(
      this.accountId?.substr(0, 4) +
        this.accountId?.substr(-4) +
        '-' +
        (this.rmrkMint?.symbol || '')
    ).toUpperCase();
  }

  get disabled(): boolean {
    const { name, symbol, max } = this.rmrkMint;
    return !(name && symbol && max && this.accountId);
  }

  public constructRmrkMint(): string {
    const mint: RmrkMint = {
      ...this.rmrkMint,
      version: this.version,
      issuer: this.accountId,
      metadata: 'https://ipfs.io/ipfs/' + this.rmrkMint?.metadata,
      id: this.rmrkId
    };

    return `rmrk::MINT::${encodeURIComponent(JSON.stringify(mint))}`;
  }

  private async submit() {
    const { api } = Connector.getInstance();
    const mintString = this.constructRmrkMint();
    try {
      console.log('submit', mintString);
      const tx = await exec(this.accountId, '', api.tx.system.remark, [mintString]);
      console.warn('TX IN', tx)
      const persisted = await getInstance()?.resolve(mintString)
      console.log('SAVED', persisted?.name)
    } catch (e) {
      console.error(e)
    }
  }

  private upload(data: any) {
    console.log('upload', data);
  }
}
</script>

// {
//   "version": "RMRK0.1",
//   "name": "Genesis limited edition obxium art NFTs on Kusama blockchain",
//   "max": 5,
//   "issuer": "DmUVjSi8id22vcH26btyVsVq39p8EVPiepdBEYhzoLL8Qby",
//   "symbol": "OKSM",
//   "id": "241B8516516F381A-OKSM",
//   "metadata": "ipfs://ipfs/QmTcaAPWPY5NinmCdDJAi6YFmyag41UEy4SpE1jn4Xdhnx"
// }
