<template>
  <div>
    <div class="box">
      <b-loading
        is-full-page
        v-model="isLoading"
        :can-cancel="true"
      ></b-loading>
      <b-field>
        <Auth />
      </b-field>
      <template v-if="accountId">
        <b-field grouped :label="$i18n.t('Collection')">
          <b-select
            placeholder="Select a collection"
            v-model="selectedCollection"
            expanded
          >
            <option
              v-for="option in collections"
              :value="option"
              :key="option.id"
            >
              {{ option.name }} {{ option.id }} {{ option.alreadyMinted }}/{{
                option.max || Infinity
              }}
            </option>
          </b-select>
          <Tooltip
            :label="$i18n.t('Select collection where do you want mint your token')"
          />
        </b-field>
      </template>
      <b-field>
        <PasswordInput
          v-if="canSubmit"
          v-model="password"
          :account="accountId"
        />
      </b-field>
      <h6 v-if="selectedCollection" class="subtitle is-6">
        You have minted {{ selectedCollection.alreadyMinted }} out of
        {{ selectedCollection.max || Infinity }}
      </h6>
      <CreateItem
        v-bind.sync="nft"
      />
      <b-field>
        <PasswordInput v-model="password" :account="accountId" />
      </b-field>
      <b-field>
        <b-button
          type="is-primary"
          icon-left="paper-plane"
          @click="submit"
          :disabled="disabled"
          :loading="isLoading"
          outlined
        >
          {{ $t("mint.submit") }}
        </b-button>
      </b-field>
      <b-field>
        <b-button
          type="is-text"
          icon-left="calculator"
          :disabled="disabled"
          :loading="isLoading"
          outlined
        >
          <template v-if="!estimated">
            {{ $t("mint.estimate") }}
          </template>
          <template v-else>
            {{ $t("mint.estimated") }}
            <Money :value="estimated" inline />
          </template>
        </b-button>
      </b-field>
      <b-field>
        <Support v-model="hasSupport" :price="filePrice" />
      </b-field>
      <b-field>
        <Support
          v-model="hasCarbonOffset"
          :price="1"
          activeMessage="I'm making carbonless NFT"
          passiveMessage="I don't want to have carbonless NFT"
        />
      </b-field>
    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Watch, Mixins } from 'vue-property-decorator';
import { emptyObject } from '@/utils/empty';
import CreateItem from './CreateItem.vue';
import Tooltip from '@/components/shared/Tooltip.vue';
import Support from '@/components/shared/Support.vue';
import Connector from '@vue-polkadot/vue-api';
import exec, { execResultValue } from '@/utils/transactionExecutor';
import { notificationTypes, showNotification } from '@/utils/notification';
import { getInstance, RmrkType } from '../service/RmrkService';
import { Collection, NFT, NFTMetadata, MintNFT } from '../service/scheme';
import { pinFile, pinJson } from '@/proxy';
import { unSanitizeIpfsUrl } from '@/utils/ipfs';
import PasswordInput from '@/components/shared/PasswordInput.vue';
import slugify from 'slugify';
import { fetchCollectionMetadata } from '../utils';
import Consolidator, {
  generateId
} from '@/components/rmrk/service/Consolidator';
import NFTUtils from '../service/NftUtils';
import RmrkVersionMixin from '@/utils/mixins/rmrkVersionMixin';
import { supportTx, MaybeFile, calculateCost } from '@/utils/support';
import collectionForMint from '@/queries/collectionForMint.graphql';
import TransactionMixin from '@/utils/mixins/txMixin';
import shouldUpdate from '@/utils/shouldUpdate';
import { nsfwAttribute, offsetAttribute, secondaryFileVisible } from './mintUtils'

interface NFTAndMeta extends NFT {
  meta: NFTMetadata;
}

type MintedCollection = {
  id: string;
  name: string;
  alreadyMinted: number;
  max: number;
  metadata: string;
  symbol: string;
};

@Component({
  components: {
    Auth: () => import('@/components/shared/Auth.vue'),
    CreateItem,
    PasswordInput,
    Tooltip,
    Support,
    BalanceInput: () => import('@/components/shared/BalanceInput.vue'),
    Money: () => import('@/components/shared/format/Money.vue'),
    Loader: () => import('@/components/shared/Loader.vue')
  }
})
export default class CreateToken extends Mixins(RmrkVersionMixin, TransactionMixin) {
    protected nft: MintNFT = {
    name: '',
    description: '',
    edition: 1,
    tags: [],
    nsfw: false,
    price: '',
    file: undefined,
  }
  protected collections: MintedCollection[] = [];
  private selectedCollection: MintedCollection | null = null;

  private password: string = '';
  private alreadyMinted = 0;
  private hasSupport: boolean = true;
  private estimated: string = '';
  private hasCarbonOffset: boolean = true;
  private filePrice: number = 0;

  get accountId() {
    return this.$store.getters.getAuthAddress;
  }

  public created() {
    if (this.accountId) {
      this.fetchCollections();
    }
  }

  @Watch('accountId', { immediate: true })
  hasAccount(value: string, oldVal: string) {
    if (shouldUpdate(value, oldVal)) {
      console.log('calling fetch', value);

      this.fetchCollections();
    }
  }

  public async fetchCollections() {
    const collections = await this.$apollo.query({
      query: collectionForMint,
      variables: {
        account: this.accountId
      }
    });

    const {
      data: { collectionEntities }
    } = collections;

    this.collections = collectionEntities.nodes
      ?.map((ce: any) => ({
        ...ce,
        alreadyMinted: ce.nfts?.totalCount
      }))
      // .filter((ce: MintedCollection) => ce.max > ce.alreadyMinted);
  }


  get disabled() {
    return !(this.nft.name && this.nft.file && this.selectedCollection)
  }


  private calculatePrice() {
    // this.filePrice = calculateCost([this.nft.file, this.nft.secondFile].filter(a => typeof a !== 'undefined'));
  }

  private toMintFormat(nft: NFT) {
    return `RMRK::MINTNFT::${this.version}::${encodeURIComponent(
      JSON.stringify(nft)
    )}`;
  }

  private toRemark(remark: string) {
    const { api } = Connector.getInstance();
    return api.tx.system.remark(remark);
  }

  protected async canSupport() {
    if (this.hasSupport) {
      // return [await supportTx([...this.images, ...this.animated])];
      return [];
    }

    return [];
  }

  protected async submit() {
    if (!this.selectedCollection) {
      throw ReferenceError('[MINT] Unable to mint without collection')
    }

    this.isLoading = true;
    this.status = 'loader.ipfs';
    const { api } = Connector.getInstance();

    try {
      const metadata = await this.constructMeta();
      const mint = NFTUtils.createNFT(this.accountId, this.alreadyMinted + 1, this.selectedCollection.symbol, this.nft.name, metadata)
      const mintString = NFTUtils.encodeNFT(mint, this.version)
    } catch (e) {
      showNotification(e, notificationTypes.danger);
      this.isLoading = false;
    }
  }


    public async constructMeta(): Promise<string> {
    if (!this.nft.file) {
      throw new ReferenceError('No file found!');
    }

    const meta: NFTMetadata = {
      name: this.nft.name,
      description: this.nft.description,
      attributes: [
        ...(this.nft?.tags || []),
        ...nsfwAttribute(this.nft.nsfw),
        ...offsetAttribute(this.hasCarbonOffset)
      ],
      external_url: `https://nft.kodadot.xyz`,
      type: this.nft.file.type
    };

    try {
      const fileHash = await pinFile(this.nft.file);

      if (!secondaryFileVisible(this.nft.file)) {
        meta.image = unSanitizeIpfsUrl(fileHash);
      } else {
        meta.animation_url = unSanitizeIpfsUrl(fileHash);
        if (this.nft.secondFile) {
          const coverImageHash = await pinFile(this.nft.secondFile);
          meta.image = unSanitizeIpfsUrl(coverImageHash);
        }
      }

      // TODO: upload meta to IPFS
      const metaHash = await pinJson(meta);
      return unSanitizeIpfsUrl(metaHash);
    } catch (e) {
      throw new ReferenceError(e.message);
    }
  }

  protected calculateSerialNumber(index: number) {
    return String(index + this.alreadyMinted + 1).padStart(16, '0');
  }
}
</script>
