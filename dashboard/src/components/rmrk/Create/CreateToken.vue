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
      @upload="uploadFile"
    />
    <b-button type="is-primary" icon-left="paper-plane" @click="submit">
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
import { notificationTypes, showNotification } from '@/utils/notification';
import { getInstance, RmrkType } from '../service/RmrkService';
import {
  Collection,
  NFT,
  NFTMetadata,
  NFTWithMeta,
  getNftId
} from '../service/scheme';
import { pinFile, pinJson, unSanitizeIpfsUrl } from '@/pinata';
import transfer from '@/router/transfer';
import min from '@polkadot/util/bn/min';

const shouldUpdate = (val: string, oldVal: string) => val && val !== oldVal;

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

interface NFTAndMeta extends NFT {
  meta: NFTMetadata;
}

@Component({
  components: {
    AccountSelect,
    CreateItem
  }
})
export default class CreateToken extends Vue {
  private version: string = '1.0.0';
  private data: Collection[] = [];
  private selectedCollection: Collection | null = null;
  private added: NFTAndMeta[] = [];
  private accountId: string = '';
  private images: (Blob | null)[] = [];

  @Watch('accountId')
  hasAccount(value: string, oldVal: string) {
    if (shouldUpdate(value, oldVal)) {
      console.log('calling fetch', value);

      this.fetchCollections();
    }
  }

  public async fetchCollections() {
    const rmrkService = getInstance();
    const data = await rmrkService?.getCollectionListForAccount(this.accountId);
    console.log('data', data);
    this.data = data || [];
  }

  get disabled() {
    return this.selectedCollection?.max === this.added.length;
  }

  private handleUpdate(item: { view: NFTAndMeta; index: number }) {
    console.log('here');
    this.$set(this.added, item.index, item.view);
  }

  private uploadFile(item: { image: Blob; index: number }) {
    this.$set(this.images, item.index, item.image);
  }

  private async makeItSexy(nft: NFTAndMeta, index: number): Promise<NFT> {
    const metaHash = await this.constructMeta(nft, index);

    const { meta, price, ...nftForMint } = nft;

    const id = getNftId(nftForMint);

    return {
      ...nftForMint,
      metadata: metaHash,
      currentOwner: this.accountId,
      id,
      _id: id,
      transferable: Number(nftForMint.transferable)
    };
  }

  private toMintFormat(nft: NFT) {
    return `RMRK::MINTNFT::${this.version}::${encodeURIComponent(
      JSON.stringify(nft)
    )}`
  }

  private toRemark(remark: string) {
    const { api } = Connector.getInstance();
    return api.tx.system.remark(remark)
  }

  public async constructMeta(nft: NFTAndMeta, index: number) {
    const image = this.images[index];
    if (!image) {
      throw new ReferenceError('No file found!');
    }

    const meta = {
      ...nft.meta,
      attributes: [],
      external_url: `https://rmrk.app/registry/${nft.collection}`
    };

    // TODO: upload image to IPFS
    const imageHash = await pinFile(image);
    meta.image = unSanitizeIpfsUrl(imageHash);
    // TODO: upload meta to IPFS
    const metaHash = await pinJson(meta);

    return unSanitizeIpfsUrl(metaHash);
  }

  private async submit() {
    const { api } = Connector.getInstance();
    const remarks: string[] = await Promise.all(this.added
    .map(this.makeItSexy)
    .map(async mint => this.toMintFormat(await mint)
    ));
    console.log('remarks', remarks);

    const batchMethods: any[] = remarks.map(this.toRemark)
    console.log('batchMethods', batchMethods)

    try {
      const tx = await exec(this.accountId, '', api.tx.utility.batch, [
        batchMethods
      ]);
      console.warn('TX IN', tx);

      showNotification(tx, notificationTypes.success);
      const rmrkService = getInstance();
      remarks.forEach(async (rmrk, index) => {
        try {
          const res = rmrkService?.resolve(rmrk, this.accountId)
          console.log('res', index, res)
        } catch (e) {
          console.warn(`Failed Indexing ${index} with err ${e}`);
          
        }
        
      })
    } catch (e) {
      showNotification(e, notificationTypes.danger);
    }
  }

  private handleAdd() {
    const rmrk = emptyObject<NFTAndMeta>();
    rmrk.collection = this.selectedCollection?.id || '';
    rmrk.sn = String(this.added.length + 1).padStart(16, '0');
    rmrk.meta = emptyObject<NFTMetadata>();
    this.added.push(rmrk);
    this.images.push(null);
  }
}
</script>
