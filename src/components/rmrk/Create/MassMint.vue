<template>
  <div class="columns mb-6">
    <div class="column is-6 is-offset-3">
      <section>
        <br />
        <Loader v-model="isLoading" :status="status" />
        <b-message
          title="Message"
          type="is-info"
          aria-close-label="Close message"
        >
          Mass mint is a feature that allows you to mint multiple tokens at
          once.
          <br />
          It is recommended to use this feature with caution.
          <br />
          Syntax:
          <br />
          <code>
            File name (e.g awesome_1.jpg)
            <br />
            Name of the NFT (e.g Awesome Token)
            <br />
            Price of the token (e.g 0.01)
            <br />
            Mutliline description of the token (e.g This is an awesome token)
          </code>
        </b-message>
        <div class="box">
          <p class="title is-size-3">
            {{ $t("mint.mass") }}
          </p>
          <b-field>
            <Auth />
          </b-field>

          <template v-if="accountId">
            <b-field :label="$i18n.t('Collection')">
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
                  {{ option.name }} {{ option.id }}
                  {{ option.alreadyMinted }}/{{ option.max || Infinity }}
                </option>
              </b-select>
            </b-field>
          </template>
          <h6 v-if="selectedCollection" class="subtitle is-6">
            You have minted {{ selectedCollection.alreadyMinted }} out of
            {{ selectedCollection.max || Infinity }}
          </h6>

          <MetadataUpload
            v-model="files"
            label="Drop all NFT images here. Currently images are supported (PNG, JPEG, GIF, SVG)"
            expanded
            multiple
            accept="image/png, image/jpeg, image/gif, image/svg+xml, image/svg"
          />

          <b-field :label="$i18n.t('mint.command')">
            <b-input
              v-model="commands"
              type="textarea"
              lines="20"
              placeholder="Add commands for your NFTs"
              spellcheck="true"
            ></b-input>
          </b-field>
          <b-field>
            <b-button type="is-info" @click="transform" outlined>
              {{ $t("mint.transform") }}
            </b-button>
          </b-field>
          <p class="title is-size-4">
            NFTs to mint ({{ massMints.length }} pieces)
          </p>

          <hr />
          <div v-for="(file, index) in massMints" :key="index">
            <MassMintItem
              v-bind.sync="massMints[index]"
              :index="index"
              :nft="file"
              :file="file.file"
              @remove="hadleItemRemoval"
            />
            <hr style="opacity: 0.1;" />
          </div>

          <b-field>
            <PasswordInput v-model="password" :account="accountId" />
          </b-field>
          <b-field>
            <b-button
              type="is-primary"
              icon-left="paper-plane"
              @click="sub"
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
              @click="estimateTx"
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
          <b-field>
            <b-switch v-model="hasToS" :rounded="false">
              {{ $t("termOfService.accept") }}
            </b-switch>
          </b-field>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator';
import { emptyObject } from '@/utils/empty';
import Support from '@/components/shared/Support.vue';
import Connector from '@vue-polkadot/vue-api';
import exec, {
  execResultValue,
  txCb,
  estimate
} from '@/utils/transactionExecutor';
import { notificationTypes, showNotification } from '@/utils/notification';
import SubscribeMixin from '@/utils/mixins/subscribeMixin';
import RmrkVersionMixin from '@/utils/mixins/rmrkVersionMixin';
import {
  Attribute,
  SimpleNFT,
  NFTMetadata,
  NFT,
  getNftId,
  MassMintNFT
} from '../service/scheme';
import { unSanitizeIpfsUrl } from '@/utils/ipfs';
import { pinJson, getKey, revokeKey } from '@/proxy';
import { generateId } from '@/components/rmrk/service/Consolidator';
import { supportTx, calculateCost, offsetTx } from '@/utils/support';
import NFTUtils, { MintType } from '../service/NftUtils';
import { DispatchError } from '@polkadot/types/interfaces';
import {
  massMintParser,
  isMatchAll,
  replaceIndex,
  isRangeSyntax,
  toRange,
  between,
  fromRange
} from './mintUtils';
import TransactionMixin from '@/utils/mixins/txMixin';
import infiniteCollectionByAccount from '@/queries/infiniteCollectionByAccount.graphql';
import shouldUpdate from '@/utils/shouldUpdate';
import { APIKeys, pinFile as pinFileToIPFS } from '@/pinata';
import { calculateBalance } from '@/utils/formatBalance';

type MintedCollection = {
  id: string;
  name: string;
  alreadyMinted: number;
  max: number;
  metadata: string;
  symbol: string;
};

const components = {
  Auth: () => import('@/components/shared/Auth.vue'),
  MetadataUpload: () => import('./DropUpload.vue'),
  PasswordInput: () => import('@/components/shared/PasswordInput.vue'),
  Tooltip: () => import('@/components/shared/Tooltip.vue'),
  Support,
  AttributeTagInput: () => import('./AttributeTagInput.vue'),
  BalanceInput: () => import('@/components/shared/BalanceInput.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
  ArweaveUploadSwitch: () => import('./ArweaveUploadSwitch.vue'),
  MassMintItem: () => import('./MassMintItem.vue')
};

@Component<MassMint>({
  metaInfo() {
    return {
      meta: [
        {
          property: 'og:title',
          content: 'KodaDot | Low fees and low carbon minting'
        },
        { property: 'og:url', content: 'https://nft.kodadot.xyz' },
        {
          property: 'og:description',
          content: 'Create carbonless NFTs with low on-chain fees'
        },
        {
          property: 'og:site_name',
          content: 'Low fees and low carbon minting'
        },
        {
          property: 'og:image',
          content: 'https://nft.kodadot.xyz/kodadot_mint.jpg'
        },
        {
          property: 'twitter:title',
          content: 'Low fees and low carbon minting'
        },
        {
          property: 'twitter:description',
          content: 'Create carbonless NFTs with low on-chain fees'
        },
        {
          property: 'twitter:image',
          content: 'https://nft.kodadot.xyz/kodadot_mint.jpg'
        }
      ]
    };
  },
  components
})
export default class MassMint extends Mixins(
  SubscribeMixin,
  RmrkVersionMixin,
  TransactionMixin
) {
  private rmrkMint: SimpleNFT = {
    ...emptyObject<SimpleNFT>(),
    max: 1
  };
  private meta: NFTMetadata = emptyObject<NFTMetadata>();
  protected commands: string = '';
  private files: File[] = [];
  private password: string = '';
  private hasToS: boolean = false;
  private hasSupport: boolean = true;
  private price: number = 0;
  private estimated: string = '';
  private hasCarbonOffset: boolean = true;
  protected arweaveUpload = false;
  protected massMints: MassMintNFT[] = [];
  protected collections: MintedCollection[] = [];
  private selectedCollection: MintedCollection | null = null;

  protected updateMeta(value: number) {
    console.log(typeof value, value);
    this.price = value;
  }

  public created() {
    if (!this.accountId) {
      console.warn('Should Redirect to /rmrk/new');
    }
  }

  public async fetchCollections() {
    const collections = await this.$apollo.query({
      query: infiniteCollectionByAccount,
      variables: {
        account: this.accountId
      },
      fetchPolicy: 'network-only'
    });

    const {
      data: { collectionEntities }
    } = collections;

    this.collections = collectionEntities.nodes
      ?.map((ce: any) => ({
        ...ce,
        alreadyMinted: ce.nfts?.totalCount
      }))
      .filter(
        (ce: MintedCollection) => (ce.max || Infinity) - ce.alreadyMinted > 0
      );
  }

  @Watch('accountId', { immediate: true })
  hasAccount(value: string, oldVal: string) {
    if (shouldUpdate(value, oldVal)) {
      this.fetchCollections();
    }
  }

  protected matchAllParser() {
    const parsed = massMintParser(this.commands);
    const applyForAll = parsed['...'];
    this.massMints = this.massMints.map((item, index) => ({
      ...item,
      ...applyForAll,
      description: replaceIndex(applyForAll.description, index + 1),
      name: replaceIndex(applyForAll.name, index + 1)
    }));
  }

  protected rangeParser() {
    const parsed = massMintParser(this.commands);
    const ranges: [number, number][] = Object.keys(parsed)
      .map(toRange)
      .filter(Boolean) as [number, number][];
    this.massMints = this.massMints.map((item, index) => {
      const range = ranges.find(([min, max]) => between(index + 1, min, max));
      if (range) {
        const key = fromRange(...range);
        const parsedItem = parsed[key];
        return {
          ...item,
          ...parsedItem,
          description: replaceIndex(parsedItem.description, index + 1),
          name: replaceIndex(parsedItem.name, index + 1)
        };
      }

      return item;
    });
  }

  protected standardParser() {
    const parsed = massMintParser(this.commands);
    this.massMints = this.massMints.map(item => ({
      ...item,
      ...(parsed[item.file?.name || item.name] || {})
    }));
  }

  public transform() {
    showNotification('Parsing commands...', notificationTypes.info);

    try {
      if (isMatchAll(this.commands)) {
        this.matchAllParser();
      } else if (isRangeSyntax(this.commands)) {
        this.rangeParser();
      } else {
        this.standardParser();
      }
      showNotification('Command parsed!', notificationTypes.success);
    } catch (e) {
      showNotification((e as Error).message, notificationTypes.danger);
    }
  }

  @Watch('files')
  public onFilesChange(files: File[]) {
    showNotification(`Added files ${files.length}`, notificationTypes.info);
    const massMints = files.map<MassMintNFT>(file => ({
      name: file.name,
      description: '',
      price: 0,
      file
    }));

    this.massMints = [...this.massMints, ...massMints];
  }

  protected hadleItemRemoval(index: number) {
    this.massMints.splice(index, 1);
  }

  get accountId() {
    return this.$store.getters.getAuthAddress;
  }

  get rmrkId(): string {
    return generateId(this.accountId, this.rmrkMint?.symbol || '');
  }

  get disabled(): boolean {
    return !(this.massMints.length && this.selectedCollection && this.hasToS);
  }

  protected async estimateTx() {
    console.log('Estimating...');
  }

  protected async sub() {
    if (!this.selectedCollection) {
      throw ReferenceError('[MASS MINT] Unable to mint without collection');
    }

    this.isLoading = true;
    const { accountId } = this;
    const { symbol, alreadyMinted } = this.selectedCollection;

    this.initTransactionLoader();
    this.status = 'loader.ipfs';

    try {
      const meta = await this.constructMeta();

      const mint = this.massMints.map((e, i) =>
        NFTUtils.createNFT(
          accountId,
          i + alreadyMinted,
          symbol,
          e.name,
          meta[i]
        )
      );
      const remarks: string[] = mint.map(nft =>
        NFTUtils.encodeNFT(nft, this.version)
      );

      this.status = 'loader.sign';
      const { api } = Connector.getInstance();

      const cb = api.tx.utility.batchAll;

      const args = !this.hasSupport
        ? remarks.map(this.toRemark)
        : [
            ...remarks.map(this.toRemark),
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

            this.listForSale(
              mint.map((e, i) => ({
                ...e,
                price: calculateBalance(
                  this.massMints[i].price,
                  this.decimals
                ).toString()
              })),
              blockNumber
            );

            showNotification(
              `[NFT] Saved ${mint.length} entries in block ${blockNumber}`,
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
    } catch (e: any) {
      showNotification(e.toString(), notificationTypes.danger);
      this.isLoading = false;
    }
  }

  protected onTxError(dispatchError: DispatchError): void {
    const { api } = Connector.getInstance();
    if (dispatchError.isModule) {
      const decoded = api.registry.findMetaError(dispatchError.asModule);
      const { docs, name, section } = decoded;
      showNotification(
        `[ERR] ${section}.${name}: ${docs.join(' ')}`,
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

  get chainProperties() {
    return this.$store.getters.getChainProperties;
  }

  get decimals(): number {
    return this.chainProperties.tokenDecimals;
  }

  get unit(): string {
    return this.chainProperties.tokenSymbol;
  }

  public async listForSale(remarks: NFT[], originalBlockNumber: string) {
    try {
      const { api } = Connector.getInstance();
      const { version } = this;
      showNotification(`[APP] Listing NFT for sale...`);

      const onlyNfts = remarks
        .filter(NFTUtils.isNFT)
        .filter(nft => nft.price && nft.price !== '0')
        .map(nft => ({ ...nft, id: getNftId(nft, originalBlockNumber) }))
        .map(nft =>
          NFTUtils.createInteraction('LIST', version, nft.id, String(nft.price))
        );

      if (!onlyNfts.length) {
        showNotification('Can not list empty NFTs', notificationTypes.danger);
        return;
      }

      this.isLoading = true;
      this.status = 'loader.casting';
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
              `[LIST] Saved prices for ${onlyNfts.length} NFTs with in block ${blockNumber}`,
              notificationTypes.success
            );

            this.isLoading = false;
            const firstNft = remarks.find(NFTUtils.isNFT);

            if (firstNft) {
              this.navigateToDetail(firstNft, originalBlockNumber);
            }
          },
          dispatchError => {
            execResultValue(tx);
            this.onTxError(dispatchError);
            this.isLoading = false;
          }
        )
      );
    } catch (e) {
      showNotification((e as Error).message, notificationTypes.danger);
    }
  }

  public offsetAttribute(): Attribute[] {
    if (!this.hasCarbonOffset) {
      return [];
    }

    return [{ trait_type: 'carbonless', value: Number(this.hasCarbonOffset) }];
  }

  get filePrice() {
    return calculateCost(this.files);
  }

  public async constructMeta(): Promise<string[]> {
    try {
      const list: string[] = [];
      let counter = 0;
      let keys: APIKeys = emptyObject();
      const total = this.massMints.length;
      for (const mint of this.massMints) {
        this.status = ['loader.uploading', [counter + 1, total]];
        if (counter % 2 === 0) {
          if (keys.pinata_api_key) {
            await revokeKey(keys.pinata_api_key);
          }
          keys = await getKey(this.accountId);
        }
        const fileHashPromise = pinFileToIPFS(mint.file as File, keys).then(
          unSanitizeIpfsUrl
        );

        const fileHash = await fileHashPromise;
        const meta = {
          name: mint.name,
          description: mint.description,
          image: fileHash,
          external_url: `https://nft.kodadot.xyz`,
          type: mint.file?.type
        };
        const ipfsPromise = pinJson(meta).then(unSanitizeIpfsUrl);
        const ipfs = await ipfsPromise;
        list.push(ipfs);
        counter++;
      }

      revokeKey(keys.pinata_api_key).then(console.log, console.warn);

      return list;
    } catch (e) {
      throw new ReferenceError((e as Error).message);
    }
  }

  protected async canSupport() {
    if (this.hasSupport && this.files) {
      return [await supportTx(this.files)];
    }

    return [];
  }

  protected async canOffset() {
    if (this.hasCarbonOffset) {
      return [await offsetTx(1)];
    }

    return [];
  }

  private toRemark(remark: string) {
    const { api } = Connector.getInstance();
    return api.tx.system.remark(remark);
  }

  protected navigateToDetail(nft: NFT, blockNumber: string) {
    showNotification('You will go to the detail in 2 seconds');
    const go = () =>
      this.$router.push({
        name: 'nftDetail',
        params: { id: getNftId(nft, blockNumber) },
        query: { message: 'congrats' }
      });
    setTimeout(go, 2000);
  }
}
</script>

<style>
.message.is-primary .message-body {
  color: #d32e79 !important;
}
</style>
