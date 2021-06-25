<template>
  <div>
    <div class="box">
      <Loader v-model="isLoading" :status="status" />
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
            :label="
              $i18n.t('Select collection where do you want mint your token')
            "
          />
        </b-field>
      </template>
      <h6 v-if="selectedCollection" class="subtitle is-6">
        You have minted {{ selectedCollection.alreadyMinted }} out of
        {{ selectedCollection.max || Infinity }}
      </h6>
      <CreateItem v-if="selectedCollection" v-bind.sync="nft" :max="selectedCollection.max" :alreadyMinted="selectedCollection.alreadyMinted" />
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
import exec, { execResultValue, txCb } from '@/utils/transactionExecutor';
import { notificationTypes, showNotification } from '@/utils/notification';
import { getInstance, RmrkType } from '../service/RmrkService';
import { Collection, NFT, NFTMetadata, MintNFT, getNftId } from '../service/scheme';
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
import { supportTx, MaybeFile, calculateCost, offsetTx } from '@/utils/support';
import collectionForMint from '@/queries/collectionForMint.graphql';
import TransactionMixin from '@/utils/mixins/txMixin';
import ChainMixin from '@/utils/mixins/chainMixin';
import shouldUpdate from '@/utils/shouldUpdate';
import {
  nsfwAttribute,
  offsetAttribute,
  secondaryFileVisible,
  toRemark
} from './mintUtils';
import { formatBalance } from '@polkadot/util';
import { DispatchError } from '@polkadot/types/interfaces';

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
export default class CreateToken extends Mixins(
  RmrkVersionMixin,
  TransactionMixin,
  ChainMixin
) {
  protected nft: MintNFT = {
    name: '',
    description: '',
    edition: 1,
    tags: [],
    nsfw: false,
    price: '',
    file: undefined,
    secondFile: undefined
  };
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

  @Watch('accountId', { immediate: true })
  hasAccount(value: string, oldVal: string) {
    if (shouldUpdate(value, oldVal)) {
      this.fetchCollections();
    }
  }

  public async fetchCollections() {
    const collections = await this.$apollo.query({
      query: collectionForMint,
      variables: {
        account: this.accountId
      },
      fetchPolicy: "network-only"
    });

    const {
      data: { collectionEntities }
    } = collections;

    this.collections = collectionEntities.nodes?.map((ce: any) => ({
      ...ce,
      alreadyMinted: ce.nfts?.totalCount
    }))
    .filter((ce: MintedCollection) => (ce.max || Infinity) - ce.alreadyMinted > 0);
  }

  get disabled() {
    return !(this.nft.name && this.nft.file && this.selectedCollection);
  }

  @Watch('nft.file')
  @Watch('nft.secondFile')
  private calculatePrice() {
    this.filePrice = calculateCost(([this.nft.file, this.nft.secondFile] as MaybeFile []).filter(a => typeof a !== 'undefined'));
  }

  private toRemark(remark: string) {
    const { api } = Connector.getInstance();
    return api.tx.system.remark(remark);
  }

  protected async canSupport() {
    if (this.hasSupport) {
      return [await supportTx([this.nft.file as MaybeFile, this.nft.secondFile as MaybeFile])]
    }

    return [];
  }

  protected async canOffset() {
    if (this.hasCarbonOffset) {
      return [await offsetTx(1)];
    }

    return [];
  }

  protected async submit() {
    if (!this.selectedCollection) {
      throw ReferenceError('[MINT] Unable to mint without collection');
    }

    this.isLoading = true;
    this.status = 'loader.ipfs';
    const { api } = Connector.getInstance();
    const { alreadyMinted, symbol } = this.selectedCollection;

    try {
      const metadata = await this.constructMeta();
      // missin possibility to handle more than one remark

      const mint = NFTUtils.createMultipleNFT(
        this.nft.edition,
        this.accountId,
        symbol,
        this.nft.name,
        metadata,
        alreadyMinted
      );
      const mintString = mint.map(nft => NFTUtils.encodeNFT(nft, this.version));

      const isSingle =
        mintString.length === 1 && (!this.hasSupport || this.hasCarbonOffset);

      const cb = isSingle ? api.tx.system.remark : api.tx.utility.batchAll;
      const args = isSingle
        ? mintString[0]
        : [
            ...mintString.map(this.toRemark),
            ...(await this.canSupport()),
            ...(await this.canOffset())
          ];

      const tx = await exec(
        this.accountId,
        '',
        cb,
        [args],
        txCb(
          async blockHash => {
            execResultValue(tx);
            const header = await api.rpc.chain.getHeader(blockHash);
            const blockNumber = header.number.toString();

            showNotification(
              `[NFT] Saved ${this.nft.edition} entries in block ${blockNumber}`,
              notificationTypes.success
            );

            this.isLoading = false;

            if (this.nft.price) {
              this.listForSale(mint, blockNumber);
            }
          },
          dispatchError => {
            execResultValue(tx);
            this.onTxError(dispatchError);
            this.isLoading = false;
          },
          res => this.resolveStatus(res.status, true)
        )
      );
    } catch (e) {
      showNotification(e.toString(), notificationTypes.danger);
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


  public async listForSale(remarks: NFT[], originalBlockNumber: string) {
    try {
    const { api } = Connector.getInstance();
    this.isLoading = true;

    const { version } = this;
    const { price } = this.nft
    showNotification(
      `[APP] Listing NFT to sale for ${formatBalance(price, {
        decimals: this.decimals,
        withUnit: this.unit
      })}`
    );

    const onlyNfts = remarks

      .map(nft => ({ ...nft, id: getNftId(nft, originalBlockNumber) }))
      .map(nft =>
        NFTUtils.createInteraction('LIST', version, nft.id, String(price))
      );

    if (!onlyNfts.length) {
      showNotification('Can not list empty NFTs', notificationTypes.danger);
      return;
    }

    const cb = api.tx.utility.batchAll;
    const args = onlyNfts.map(this.toRemark);

    const tx = await exec(
      this.accountId,
      '',
      cb,
      [args],
      txCb(
        async blockHash => {
          execResultValue(tx);
          const header = await api.rpc.chain.getHeader(blockHash);
          const blockNumber = header.number.toString();

          showNotification(
            `[LIST] Saved prices for ${
              onlyNfts.length
            } NFTs with tag ${formatBalance(price, {
              decimals: this.decimals,
              withUnit: this.unit
            })} in block ${blockNumber}`,
            notificationTypes.success
          );

          this.isLoading = false;
        },
        dispatchError => {
          execResultValue(tx);
          this.onTxError(dispatchError);
          this.isLoading = false;
        },
        res => this.resolveStatus(res.status)
      )
    );

    } catch (e) {
      showNotification(e.message, notificationTypes.danger)
    }

  }


    protected onTxError(dispatchError: DispatchError): void {
    const { api } = Connector.getInstance();
    if (dispatchError.isModule) {
      const decoded = api.registry.findMetaError(dispatchError.asModule);
      const { documentation, name, section } = decoded;
      showNotification(
        `[ERR] ${section}.${name}: ${documentation.join(' ')}`,
        notificationTypes.danger
      );
    } else {
      showNotification(
        `[ERR] ${dispatchError.toString()}`,
        notificationTypes.danger
      );
    }

    this.isLoading = false;
  }
}
</script>
