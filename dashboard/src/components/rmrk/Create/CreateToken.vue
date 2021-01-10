<template>
  <div>
    <AccountSelect label="Account" v-model="accountId" />
    <b-field v-if="accountId" label="Collection">
      <b-select placeholder="Select a collection" v-model="selectedCollection">
        <option v-for="option in data" :value="option" :key="option.id">
          {{ option.name }} {{ option.id }}
        </option>
      </b-select>
    </b-field>
    <b-button
      v-if="selectedCollection"
      type="is-primary"
      icon-left="plus"
      @click="handleAdd"
      :disabled="disabled"
    >
      Add
    </b-button>

    <CreateItem
      v-for="(item, index) in added"
      :key="index"
      :index="index"
      :view="item"
      @update="handleUpdate"
    />
    <b-button
      type="is-primary"
      icon-left="paper-plane"
      @click="submit"
    >
      Submit
    </b-button>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { RmrkMint, RmrkView } from '../types';
import { emptyObject } from '@/utils/empty';
import CreateItem from './CreateItem.vue';
import AccountSelect from '@/components/shared/AccountSelect.vue';
import Connector from '@vue-polkadot/vue-api';
import exec from '@/utils/transactionExecutor';
import { notificationTypes,  showNotification } from '@/utils/notification';
import { getInstance, RmrkType } from '../service/RmrkService';
import { Collection, NFT, NFTMetadata, NFTWithMeta } from '../service/scheme';
import { pinFile, pinJson, unSanitizeIpfsUrl } from '@/pinata';

const shouldUpdate = (val: string, oldVal: string) => val && (val !== oldVal)

const test: RmrkMint = {
  name: 'Test Collection',
  max: 4,
  symbol: 'ALC',
  metadata:
    'https://ipfs.io/ipfs/QmTcaAPWPY5NinmCdDJAi6YFmyag41UEy4SpE1jn4Xdhnx',
  version: 'RMRK0.1',
  issuer: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
  id: '5GRWUTQY-ALC'
};

@Component({
  components: {
    AccountSelect,
    CreateItem
  }
})
export default class CreateToken extends Vue {
  private data: Collection[] = [];
  private selectedCollection: Collection | null = null;
  private added: NFTWithMeta[] = [];
  private accountId: string = '';

 @Watch('accountId')
 hasAccount(value: string, oldVal: string) {
   if (shouldUpdate(value, oldVal)) {
     this.fetchCollections()
   }
 }

  public async fetchCollections() {
    const rmrkService = getInstance()
    this.data = await rmrkService?.getCollectionListForAccount(this.accountId) || []
  }

  get disabled() {
    return this.selectedCollection?.max === this.added.length;
  }

  private handleUpdate(item: { view: RmrkView; index: number }) {
    this.$set(this.added, item.index, item.view);
  }

  private async submit() {
    const { api } = Connector.getInstance();
    const batchMethods: any[] = this.added.map(mint => api.tx.system.remark(encodeURIComponent(`rmrk::MINTNFT::${JSON.stringify(mint)}`)))
    console.log(batchMethods);
    try {
      const tx = await exec(this.accountId, '', api.tx.utility.batch, [batchMethods]);
      console.warn('TX IN', tx)
      showNotification(tx, notificationTypes.success);
    } catch (e) {
      showNotification(e, notificationTypes.danger);
    }
    
  }



  private handleAdd() {
    const rmrk = emptyObject<RmrkView>();
    rmrk.collection = this.selectedCollection?.id || '';
    this.added.push(rmrk);
  }
}
</script>
