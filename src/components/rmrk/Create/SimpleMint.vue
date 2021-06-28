<template>
  <div class="columns mb-6">
    <div class="column is-7 is-offset-3">
      <section>
        <br />
        <Loader v-model="isLoading" :status="status" />
        <div class="box">
          <p class="title is-size-3">
            <!-- {{ $t('mint.context') }} -->
            Create NFT Collectibles
          </p>
          <p class="subtitle is-size-7">{{ $t("using") }} {{ version }}</p>
          <b-field>
            <div>
              {{ $t("computed id") }}: <b>{{ rmrkId }}</b>
            </div>
          </b-field>
          <b-field>
            <Auth />
          </b-field>

          <MetadataUpload
            v-model="file"
            label="Drop your NFT here or click to upload. We support various media types (bmp/ gif/ jpeg/ png/ svg/ tiff/ webp/ mp4/ ogv/ quicktime/ webm/ glb/ flac/ mp3/ json)"
            expanded
          />

          <b-field grouped :label="$i18n.t('Name')">
            <b-input
              placeholder="Name your NFT"
              v-model="rmrkMint.name"
              expanded
              class="mr-0"
              spellcheck="true"
            ></b-input>
            <Tooltip iconsize="is-medium" :label="$i18n.t('tooltip.name')" />
          </b-field>
          <b-field grouped :label="$i18n.t('Symbol')" class="mb-0">
            <b-input
              placeholder="3-5 character long name"
              maxlength="10"
              @keydown.native.space.prevent
              v-model="rmrkMint.symbol"
              expanded
              class="mr-0"
            ></b-input>
            <Tooltip iconsize="is-medium" :label="$i18n.t('tooltip.symbol')" />
          </b-field>

          <b-field :label="$i18n.t('Collection description')" class="mb-0">
            <b-input
              v-model="meta.description"
              maxlength="500"
              type="textarea"
              placeholder="Describe your NFT"
              spellcheck="true"
            ></b-input>
          </b-field>

          <b-field grouped :label="$i18n.t('Edition')">
            <b-numberinput
              v-model="rmrkMint.max"
              placeholder="1 is minumum"
              expanded
              :min="1"
            ></b-numberinput>
            <Tooltip iconsize="is-medium" :label="$i18n.t('tooltip.edition')" />
          </b-field>

          <MetadataUpload
            v-if="secondaryFileVisible"
            label="Your NFT requires a poster/cover to be seen in gallery. Please upload image (jpg/ png/ gif)"
            v-model="secondFile"
            icon="file-image"
            accept="image/png, image/jpeg, image/gif"
            expanded
          />
          <AttributeTagInput
            v-model="rmrkMint.tags"
            placeholder="Get discovered easier through tags"
          />

          <b-field>
            <b-switch v-model="nsfw" :rounded="false">
              {{ nsfw ? "NSFW" : "SFW" }}
            </b-switch>
          </b-field>

          <BalanceInput @input="updateMeta" label="Price" />
          <b-message
            v-if="price"
            icon="exclamation-triangle"
            class="mt-3"
            title="Additional transaction"
            type="is-primary"
            has-icon
            aria-close-label="Close message"
          >
            <span class="has-text-primary"
              >Setting the price now requires making an additional
              transaction.</span
            >
          </b-message>

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
          <ArweaveUploadSwitch  v-model="arweaveUpload" />
          <b-field>
            <b-switch v-model="hasToS"
              :rounded="false">
              {{ $t("termOfService.accept") }}
            </b-switch>
          </b-field>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { MediaType } from '../types';
import { emptyObject } from '@/utils/empty';
import Tooltip from '@/components/shared/Tooltip.vue';
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
  getNftId
} from '../service/scheme';
import { unSanitizeIpfsUrl } from '@/utils/ipfs';
import { pinFile, pinJson } from '@/proxy';
import { formatBalance } from '@polkadot/util';
import { generateId } from '@/components/rmrk/service/Consolidator';
import { supportTx, calculateCost, offsetTx } from '@/utils/support';
import { resolveMedia } from '../utils';
import NFTUtils, { MintType } from '../service/NftUtils';
import { DispatchError } from '@polkadot/types/interfaces';
import { ipfsToArweave } from '@/utils/ipfs'

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
  ArweaveUploadSwitch: () => import('./ArweaveUploadSwitch.vue')
};

@Component<SimpleMint>({
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
export default class SimpleMint extends Mixins(
  SubscribeMixin,
  RmrkVersionMixin
) {
  private rmrkMint: SimpleNFT = {
    ...emptyObject<SimpleNFT>(),
    max: 1
  };
  private meta: NFTMetadata = emptyObject<NFTMetadata>();
  // private accountId: string = '';
  private uploadMode: boolean = true;
  private file: Blob | null = null;
  private secondFile: Blob | null = null;
  private isLoading: boolean = false;
  private password: string = '';
  private hasToS: boolean = false;
  private hasSupport: boolean = true;
  private nsfw: boolean = false;
  private price: number = 0;
  private estimated: string = '';
  private hasCarbonOffset: boolean = true;
  protected status = '';
  protected arweaveUpload = false;

  protected updateMeta(value: number) {
    console.log(typeof value, value);
    this.price = value;
  }

  public created() {
    if (!this.accountId) {
      console.warn('Should Redirect to /rmrk/new');
    }
  }

  get fileType() {
    return resolveMedia(this.file?.type);
  }

  get secondaryFileVisible() {
    const fileType = this.fileType;
    return ![MediaType.UNKNOWN, MediaType.IMAGE].some(t => t === fileType);
  }

  get accountId() {
    return this.$store.getters.getAuthAddress;
  }

  get rmrkId(): string {
    return generateId(this.accountId, this.rmrkMint?.symbol || '');
  }

  get disabled(): boolean {
    const { name, symbol, max } = this.rmrkMint;
    return !(name && symbol && max && this.hasToS && this.accountId && this.file);
  }

  protected async estimateTx() {
    this.isLoading = true;
    const { accountId, version } = this;
    const { api } = Connector.getInstance();

    const result = NFTUtils.generateRemarks(this.rmrkMint, accountId, version);
    const cb = api.tx.utility.batchAll;
    const remarks: string[] = Array.isArray(result)
      ? result
      : [
          NFTUtils.toString(result.collection, version),
          ...result.nfts.map(nft => NFTUtils.toString(nft, version))
        ];

    const args = !this.hasSupport
      ? remarks.map(this.toRemark)
      : [
          ...remarks.map(this.toRemark),
          ...(await this.canSupport()),
          ...(await this.canOffset())
        ];

    this.estimated = await estimate(this.accountId, cb, [args]);

    this.isLoading = false;
  }

  protected async sub() {
    this.isLoading = true;
    const { accountId, version } = this;
    const { api } = Connector.getInstance();

    const meta = await this.constructMeta();
    this.rmrkMint.metadata = meta;

    const result = NFTUtils.generateRemarks(
      this.rmrkMint,
      accountId,
      version
    ) as MintType;
    const cb = api.tx.utility.batchAll;
    const remarks: string[] = Array.isArray(result)
      ? result
      : [
          NFTUtils.toString(result.collection, version),
          ...result.nfts.map(nft => NFTUtils.toString(nft, version))
        ];

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

          if (this.price) {
            this.listForSale(result.nfts, blockNumber);
          } else {
            this.navigateToDetail(result.nfts[0], blockNumber);
          }

          showNotification(
            `[NFT] Saved ${this.rmrkMint.max} entries in block ${blockNumber}`,
            notificationTypes.success
          );

          this.isLoading = false;
        },
        dispatchError => {
          execResultValue(tx);
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
        },
        res => {
          if (res.status.isReady) {
            this.status = 'loader.casting';
            return;
          }

          if (res.status.isInBlock) {
            this.status = 'loader.block';
            return;
          }

          if (res.status.isFinalized) {
            this.status = 'loader.finalized';
            return;
          }

          this.status = '';
        }
      )
    );

    // check validity
    // PIN Image
    // Construct and pin JSON
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
      this.isLoading = true;

      const { price, version } = this;
      showNotification(
        `[APP] Listing NFT to sale for ${formatBalance(price, {
          decimals: this.decimals,
          withUnit: this.unit
        })}`
      );

      const onlyNfts = remarks
        .filter(NFTUtils.isNFT)
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
                this.rmrkMint.max
              } NFTs with tag ${formatBalance(price, {
                decimals: this.decimals,
                withUnit: this.unit
              })} in block ${blockNumber}`,
              notificationTypes.success
            );

            this.isLoading = false;
            // TODO: V1
            // this.navigateToDetail(remarks.filter(), originalBlockNumber);
          },
          dispatchError => {
            execResultValue(tx);
            this.onTxError(dispatchError);
            this.isLoading = false;
          }
        )
      );
    } catch (e) {
      showNotification(e.message, notificationTypes.danger);
    }
  }

  public nsfwAttribute(): Attribute[] {
    if (!this.nsfw) {
      return [];
    }

    return [{ trait_type: 'NSFW', value: Number(this.nsfw) }];
  }

  public offsetAttribute(): Attribute[] {
    if (!this.hasCarbonOffset) {
      return [];
    }

    return [{ trait_type: 'carbonless', value: Number(this.hasCarbonOffset) }];
  }

  get filePrice() {
    return calculateCost(this.file);
  }

  public async constructMeta(): Promise<string> {
    if (!this.file) {
      throw new ReferenceError('No file found!');
    }

    this.meta = {
      ...this.meta,
      attributes: [
        ...(this.rmrkMint?.tags || []),
        ...this.nsfwAttribute(),
        ...this.offsetAttribute()
      ],
      external_url: `https://nft.kodadot.xyz`,
      type: this.file.type
    };

    try {
      const fileHash = await pinFile(this.file);

      if (!this.secondaryFileVisible) {
        this.meta.image = unSanitizeIpfsUrl(fileHash);
        this.meta.image_ar = this.arweaveUpload ? await ipfsToArweave(fileHash) : '';
      } else {
        this.meta.animation_url = unSanitizeIpfsUrl(fileHash);
        if (this.secondFile) {
          const coverImageHash = await pinFile(this.secondFile);
          this.meta.image = unSanitizeIpfsUrl(coverImageHash);
        }
      }

      // TODO: upload meta to IPFS
      const metaHash = await pinJson(this.meta);
      return unSanitizeIpfsUrl(metaHash);
    } catch (e) {
      throw new ReferenceError(e.message);
    }
  }

  protected async canSupport() {
    if (this.hasSupport && this.file) {
      return [await supportTx(this.file)];
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
