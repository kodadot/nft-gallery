<template>
  <div class="columns mb-6">
    <div class="column is-7 is-offset-3">
      <section>
        <br />
        <Loader v-model="isLoading" :status="status" />
        <div class="box">
          <p class="title is-size-3">
            <!-- {{ $t('mint.context') }} -->
            Create NFT using ERC-721 in Ask!
          </p>
          <p class="subtitle is-size-7">{{ $t("using") }} {{ version }}</p>

          <b-field>
            <Auth />
          </b-field>

          <b-field label="Contract address">
            <b-input
              placeholder="Address of your ERC-721 contract"
              v-model="contractAddr"
              expanded
            />
          </b-field>

          <MetadataUpload
            v-model="file"
            label="Drop your NFT here or click to upload. We support various media types (image/png, image/jpeg, image/gif)"
            icon="file-image"
            accept="image/png, image/jpeg, image/gif"
            expanded
            preview
          />

          <b-field grouped :label="$i18n.t('Name')">
            <b-input
              placeholder="Name your NFT"
              v-model="meta.name"
              expanded
              class="mr-0"
              spellcheck="true"
            ></b-input>
            <Tooltip iconsize="is-medium" :label="$i18n.t('tooltip.name')" />
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

          <AttributeTagInput
            v-model="meta.tags"
            placeholder="Get discovered easier through tags"
          />

          <b-field>
            <b-switch v-model="nsfw" :rounded="false">
              {{ nsfw ? "NSFW" : "SFW" }}
            </b-switch>
          </b-field>

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
import Support from '@/components/shared/Support.vue';
import Connector from '@vue-polkadot/vue-api';
import {
  execResultValue,
  txCb,
  ContractParams,
  defaultContractOptions,
  contractExec
} from '@/utils/transactionExecutor';
import { notificationTypes, showNotification } from '@/utils/notification';
import SubscribeMixin from '@/utils/mixins/subscribeMixin';
import RmrkVersionMixin from '@/utils/mixins/rmrkVersionMixin';
import {
  Attribute,
  NFTMetadata,
  NFT,
  getNftId
} from '../service/scheme';
import { unSanitizeIpfsUrl } from '@/utils/ipfs';
import { pinFile, pinJson } from '@/proxy';
import { supportTx, calculateCost, offsetTx } from '@/utils/support';
import { resolveMedia } from '../utils';
import { DispatchError } from '@polkadot/types/interfaces';
import { ipfsToArweave } from '@/utils/ipfs';
import { ContractPromise } from '@polkadot/api-contract';
import abi from './abi'
import TransactionMixin from '@/utils/mixins/txMixin';

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

@Component<ContractMint>({
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
export default class ContractMint extends Mixins(
  SubscribeMixin,
  RmrkVersionMixin,
  TransactionMixin
) {
  private meta: NFTMetadata = emptyObject<NFTMetadata>();
  // private accountId: string = '';
  private uploadMode: boolean = true;
  private file: Blob | null = null;
  private secondFile: Blob | null = null;
  private password: string = '';
  private hasToS: boolean = false;
  private hasSupport: boolean = true;
  private nsfw: boolean = false;
  private price: number = 0;
  private estimated: string = '';
  private hasCarbonOffset: boolean = true;
  protected arweaveUpload = false;
  protected contractAddr: string = '';

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

  get disabled(): boolean {
    const { name } = this.meta;
    return !(name && this.hasToS && this.accountId && this.file);
  }


  protected async sub() {
    this.isLoading = true;
    const { accountId, contractAddr } = this;
    const { api } = Connector.getInstance();

    try {
      if (!contractAddr) {
        throw new ReferenceError('[NO CONTRACT]')
      }

    const meta = await this.constructMeta();
    // const contractAddr = '15rd4kN3htRYJdPSAAvswNWskBQn5tBfwKZHxuWeFQsE8VeA'
    const contract = new ContractPromise(api, abi, contractAddr)
    const cb = contract.tx.mint;
    const params: ContractParams = {
      options: { ...defaultContractOptions },
      params: [meta]
    }

    const tx = await contractExec(
      this.accountId,
      '',
      cb,
      params,
      txCb(
        async (blockHash, events) => {
          execResultValue(tx);
          const header = await api.rpc.chain.getHeader(blockHash);
          const blockNumber = header.number.toString();

          showNotification(
            `[NFT] Saved entries in block ${blockNumber}`,
            notificationTypes.success
          );

          console.log(events)

          if (events && Array.isArray(events)) {
            const event = events.find(e => e.event.identifier === 'Transfer')
            console.log(event, event.args[2].toNumber())
            if (event) {
              this.navigateToDetail(event.args[2].toNumber())
            }
          }

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
        res => this.resolveStatus(res.status),
        true
      )
    );
    } catch (e) {
      showNotification(
              `[ERR] ${e.message}`,
              notificationTypes.danger
            );
      console.error(e)
    }



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
        ...(this.meta?.attributes || []),
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

  protected navigateToDetail(tokenId: string) {
    showNotification('You will go to the detail in 2 seconds');
    const go = () =>
      this.$router.push({
        name: 'superDetail',
        params: { id: this.contractAddr, item: tokenId },
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
