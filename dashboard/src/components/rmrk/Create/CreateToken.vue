<template>
  <div>
    <div class="box">
      <b-loading is-full-page v-model="isLoading" :can-cancel="true"></b-loading>
      <b-field>
        <Auth />
      </b-field>
      <template v-if="accountId">
        <b-field>
          <b-switch v-model="oneByOne"
            passive-type="is-dark"
            :rounded="false">
            {{ oneByOne ? 'Single NFT' : 'NFT(s) in collection' }}
          </b-switch>
        </b-field>
        <b-field grouped v-if="!oneByOne" :label="$i18n.t('Collection')">
        <b-select placeholder="Select a collection" v-model="selectedCollection" expanded>
          <option v-for="option in data" :value="option" :key="option.id">
            {{ option.name }} {{ option.id }}
          </option>
        </b-select>
        <Tooltip :label="$i18n.t('Select collection where do you want mint your token')" />
      </b-field>
      <b-field v-else grouped :label="$i18n.t('Symbol')">
        <b-input placeholder="3-5 character long name"  v-model="symbol" expanded></b-input>
        <Tooltip :label="$i18n.t('Symbol you want to trade it under')" />
      </b-field>
      </template>
      <b-field>
        <PasswordInput v-if="canSubmit" v-model="password" :account="accountId" />
      </b-field>
      <CreateItem
        v-for="(item, index) in added"
        :key="index"
        :index="index"
        :alreadyMinted="alreadyMinted"
        :view="item"
        @update="handleUpdate"
        @upload="uploadFile"
        @animated="uploadAnimatedFile"
        @remove="hadleItemRemoval"
      />
      <b-field grouped>
        <b-field position="is-left" expanded>
          <b-button
            v-if="accountId && (selectedCollection || singleNFTValid)"
            type="is-info"
            icon-left="plus"
            @click="handleAdd"
            :disabled="disabled"
            outlined
          >
            {{ $t('Add Token') }}
          </b-button>
        </b-field >
        <b-field position="is-right">
            <b-button v-if="canSubmit" type="is-primary" icon-left="paper-plane" outlined @click="submit" :loading="isLoading">
              {{ $t('Mint') }}
            </b-button>
        </b-field>
      </b-field>

    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
import { RmrkMint, RmrkView } from '../types';
import { emptyObject } from '@/utils/empty';
import CreateItem from './CreateItem.vue';
import Tooltip from '@/components/shared/Tooltip.vue';
import Connector from '@vue-polkadot/vue-api';
import exec, { execResultValue } from '@/utils/transactionExecutor';
import { notificationTypes, showNotification } from '@/utils/notification';
import { getInstance, RmrkType } from '../service/RmrkService';
import {
  Collection,
  NFT,
  NFTMetadata,
} from '../service/scheme';
import { pinFile, pinJson, unSanitizeIpfsUrl } from '@/pinata';
import PasswordInput from '@/components/shared/PasswordInput.vue';
import slugify from 'slugify'
import { fetchCollectionMetadata } from '../utils';
import { generateId } from '@/components/rmrk/service/Consolidator'
import NFTUtils from '../service/NftUtils';
import RmrkVersionMixin from '@/utils/mixins/rmrkVersionMixin';

const shouldUpdate = (val: string, oldVal: string) => val && val !== oldVal;

interface NFTAndMeta extends NFT {
  meta: NFTMetadata;
}

@Component({
  components: {
    Auth: () => import('@/components/shared/Auth.vue'),
    CreateItem,
    PasswordInput,
    Tooltip
  }
})
export default class CreateToken extends Mixins(RmrkVersionMixin) {
  private data: Collection[] = [];
  private selectedCollection: Collection | null = null;
  private added: NFTAndMeta[] = [];
  // private accountId: string = '';
  private images: (Blob | null)[] = [];
  private animated: (Blob | null)[] = [];
  private isLoading: boolean = false;
  private password: string = '';
  private alreadyMinted = 0;
  private oneByOne: boolean = true;
  private symbol: string = '';

  get accountId() {
    return this.$store.getters.getAuthAddress;
  }

  public created() {
    this.fetchCollections();
  }

  @Watch('accountId')
  hasAccount(value: string, oldVal: string) {
    if (shouldUpdate(value, oldVal)) {
      console.log('calling fetch', value);

      this.fetchCollections();
    }
  }

  @Watch('selectedCollection')
  get(value: Collection | null, oldVal: Collection | null) {
    if (value?.id !== oldVal?.id) {
      console.log('calling fetch', value?.id);
      this.fetchAlreadyMinted()
    }
  }

  public async fetchAlreadyMinted() {
    const rmrkService = getInstance();
    if (this.selectedCollection) {
      const data = await rmrkService?.getNFTsForCollection(this.selectedCollection?.id);
    this.alreadyMinted = Number(data?.length);
      console.log('Already minted', this.alreadyMinted)
    }

  }

  public async fetchCollections() {
    const rmrkService = getInstance();
    const data = await rmrkService?.getCollectionListForAccount(this.accountId);
    console.log('data', data);
    this.data = data || [];
  }

  get canSubmit() {
    return this.added.length
  }

  get singleNFTValid() {
    return this.oneByOne && this.symbol
  }

  get disabled() {
    const max = this.oneByOne ? 1 : this.selectedCollection?.max || 0
    return max <= this.added.length + this.alreadyMinted;
  }

  private handleUpdate(item: { view: NFTAndMeta; index: number }) {
    console.log('here');
    this.$set(this.added, item.index, item.view);
  }

  private uploadFile(item: { image: Blob; index: number }) {
    this.$set(this.images, item.index, item.image);
  }

    private uploadAnimatedFile(item: { image: Blob; index: number }) {
    this.$set(this.animated, item.index, item.image);
  }

  private async makeItSexy(nft: NFTAndMeta, index: number): Promise<NFT> {
    const metaHash = await this.constructMeta(nft, index);

    const { meta, price, ...nftForMint } = nft;

    return {
      ...nftForMint,
      metadata: metaHash,
      currentOwner: this.accountId,
      transferable: Number(nftForMint.transferable),
      instance: slugify(nftForMint.name, '_').toUpperCase(),
      collection: this.oneByOne ? generateId(this.accountId, this.symbol) : nftForMint.collection
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

    const meta = {
      ...nft.meta,
      attributes: [],
      external_url: `https://rmrk.app/registry/${nft.collection}`
    };

     if (!image) {
      const collectionMeta = await fetchCollectionMetadata(this.selectedCollection || emptyObject<Collection>());
      meta.image = collectionMeta.image;
    } else {
      const imageHash = await pinFile(image);
      meta.image = unSanitizeIpfsUrl(imageHash);
    }

    const animatedFile = this.animated[index];
    if (animatedFile) {
      const animatedHash = await pinFile(animatedFile);
      meta.animation_url = unSanitizeIpfsUrl(animatedHash);
    }

    // TODO: upload meta to IPFS
    const metaHash = await pinJson(meta);

    return unSanitizeIpfsUrl(metaHash);
  }

  protected async submit() {
    this.isLoading = true;
    const { api } = Connector.getInstance();
    const nfts: NFT[] = await Promise.all(this.added.map(this.makeItSexy));

    const remarks: string[] = nfts.map(this.toMintFormat)

    if (!remarks.length) {
      throw new RangeError('Unable to process empty NFTs!')
    }

    const firstNFT = nfts[0];
    const collectionToMint: string[] = this.oneByOne ? [NFTUtils.encodeCollection(NFTUtils.collectionFromNFT(this.symbol, firstNFT, this.version), this.version)] : []

    const batchMethods = [...collectionToMint.map(this.toRemark), ...remarks.map(this.toRemark)]
    console.log('batchMethods', batchMethods)
    const rmrkService = getInstance();

    try {
      const tx = await exec(this.accountId, this.password, api.tx.utility.batchAll, [
        batchMethods
      ], async (result) => {
        console.log(`Current status is`, result);
        if (result.status.isFinalized) {
          console.log(`finalized status is`, result);
          console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
          execResultValue(tx)
          const header = await api.rpc.chain.getHeader(result.status.asFinalized);
          const blockNumber = header.number.toString();
          for (const [index, rmrk] of [...collectionToMint, ...remarks].entries()) {
            this.isLoading = true;
            try {
              const res = await rmrkService?.resolve(rmrk, this.accountId, blockNumber)
              showNotification(`[TEXTILE] ${res?._id}`, notificationTypes.success)
              console.log('res', index, res)
            } catch (e) {
              console.warn(`Failed Indexing ${index} with err ${e}`);
            }
            this.isLoading = false;
          }
        }
      });
      console.warn('TX IN', tx);
      showNotification(`[CHAIN] Waiting to finalize block and save to TEXTILE`)

    } catch (e) {
      showNotification(e, notificationTypes.danger);
      this.isLoading = false;
    }


  }

  protected handleAdd() {
    const rmrk = emptyObject<NFTAndMeta>();
    rmrk.collection = this.oneByOne ? generateId(this.accountId, this.symbol) : this.selectedCollection?.id || '';
    rmrk.sn = this.calculateSerialNumber(this.added.length);
    rmrk.meta = emptyObject<NFTMetadata>();
    rmrk.transferable = 1;
    this.added.push(rmrk);
    this.images.push(null);
    this.animated.push(null)
  }

  protected hadleItemRemoval(index: number) {
    this.added.splice(index, 1);
    this.added.forEach((nft, i) => nft.sn = this.calculateSerialNumber(i))
    for (let i = index; i < this.added.length; i++) {
      this.$set(this.images, i, this.images[i + 1]);
      this.$set(this.animated, i, this.animated[i + 1]);
    }
    this.$set(this.images, this.added.length, null);
    this.$set(this.animated, this.added.length, null);
  }

  protected calculateSerialNumber(index: number) {
    return String(index + this.alreadyMinted +  1).padStart(16, '0');
  }
}
</script>
