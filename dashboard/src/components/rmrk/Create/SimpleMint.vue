<template>
  <div class="columns">
    <div class="column is-7 is-offset-3">
      <section>
        <br />
        <b-loading
          is-full-page
          v-model="isLoading"
          :can-cancel="true"
        ></b-loading>
        <div class="box">
          <p class="title is-size-3">
            <!-- {{ $t('mint.context') }} -->
            Create NFT
          </p>
          <p class="subtitle is-size-7">{{ $t('using') }} {{ version }}</p>
          <b-field>
            <div>
              {{ $t('computed id') }}: <b>{{ rmrkId }}</b>
            </div>
          </b-field>
          <b-field>
            <Auth />
          </b-field>

          <MetadataUpload v-model="file" expanded />
          <div v-if="file">{{ file.type }}</div>

          <b-field grouped :label="$i18n.t('Name')">
            <b-input
              placeholder="Name of the NFT"
              v-model="rmrkMint.name"
              expanded
            ></b-input>
            <Tooltip :label="$i18n.t('Owner address of minted art')" />
          </b-field>
          <b-field grouped :label="$i18n.t('Symbol')">
            <b-input
              placeholder="3-5 character long name"
              maxlength="10"
              @keydown.native.space.prevent
              v-model="rmrkMint.symbol"
              expanded
            ></b-input>
            <Tooltip :label="$i18n.t('Symbol you want to trade it under')" />
          </b-field>

          <b-field :label="$i18n.t('Collection description')">
            <b-input
              v-model="meta.description"
              maxlength="500"
              type="textarea"
              placeholder="Tell sometinng more about the NFT"
            ></b-input>
          </b-field>

          <b-field :label="$i18n.t('Maximum NFTs in collection')">
            <b-numberinput
              v-model="rmrkMint.max"
              placeholder="1 is minumum"
              :min="1"
            ></b-numberinput>
          </b-field>

          <MetadataUpload
            v-if="secondaryFileVisible"
            label="Your NFT requires a poster/cover to be seen in gallery. Please upload image (jpg/png/gif)"
            v-model="secondFile"
            icon="file-image"
            expanded
          />
          <AttributeTagInput
            v-model="rmrkMint.tags"
            placeholder="Get discovered easier through tags"
          />

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
              {{ $t('mint.submit') }}
            </b-button>
          </b-field>
          <b-field>
            <Support v-model="hasSupport" :price="filePrice" />
          </b-field>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import { RmrkMint, MediaType } from '../types';
import { emptyObject } from '@/utils/empty';
import AccountSelect from '@/components/shared/AccountSelect.vue';
import Tooltip from '@/components/shared/Tooltip.vue';
import Support from '@/components/shared/Support.vue';
import MetadataUpload from './DropUpload.vue';
import Connector from '@vue-polkadot/vue-api';
import exec, {
  execResultValue,
  Extrinsic,
  txCb
} from '@/utils/transactionExecutor';
import { notificationTypes, showNotification } from '@/utils/notification';
import PasswordInput from '@/components/shared/PasswordInput.vue';
import SubscribeMixin from '@/utils/mixins/subscribeMixin';
import RmrkVersionMixin from '@/utils/mixins/rmrkVersionMixin';

import { getInstance, RmrkType } from '../service/RmrkService';
import {
  Collection,
  CollectionMetadata,
  SimpleNFT,
  NFTMetadata
} from '../service/scheme';
import { unSanitizeIpfsUrl } from '@/utils/ipfs';
import { pinFile, pinJson } from '@/proxy';
import { decodeAddress } from '@polkadot/keyring';
import { u8aToHex } from '@polkadot/util';
import Consolidator, {
  generateId
} from '@/components/rmrk/service/Consolidator';
import { supportTx, calculateCost } from '@/utils/support';
import { resolveMedia } from '../utils';
import NFTUtils from '../service/NftUtils';

const components = {
  Auth: () => import('@/components/shared/Auth.vue'),
  MetadataUpload,
  PasswordInput,
  Tooltip,
  Support,
  AttributeTagInput: () => import('./AttributeTagInput.vue')
};

@Component({ components })
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
  private hasSupport: boolean = true;

  public mounted() {
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

  get accountIdToPubKey() {
    return (this.accountId && u8aToHex(decodeAddress(this.accountId))) || '';
  }

  private generateId(pubkey: string): string {
    return (
      pubkey?.substr(2, 10) +
      pubkey?.substring(pubkey.length - 8) +
      '-' +
      (this.rmrkMint?.symbol || '')
    )
      .trim()
      .toUpperCase();
  }

  get disabled(): boolean {
    const { name, symbol, max } = this.rmrkMint;
    return !(name && symbol && max && this.accountId && this.file);
  }

  public constructRmrkMint(): Collection {
    // const mint: Collection = {
    //   ...this.rmrkMint,
    //   symbol: this.rmrkMint.symbol.trim().toUpperCase(),
    //   version: this.version,
    //   issuer: this.accountId,
    //   metadata: unSanitizeIpfsUrl(this.rmrkMint?.metadata),
    //   id: this.rmrkId
    // };

    // return mint;
    return emptyObject<Collection>();
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
      version,
      true
    );
    const cb = api.tx.utility.batchAll;
    const remarks: string[] = Array.isArray(result)
      ? result
      : [
          NFTUtils.toString(result.collection, version),
          ...result.nfts.map(nft => NFTUtils.toString(nft, version))
        ];

    const rmrkService = getInstance();

    const args = !this.hasSupport
      ? remarks.map(this.toRemark)
      : [...remarks.map(this.toRemark), ...(await this.canSupport())];

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
          for (const [index, rmrk] of remarks.entries()) {
            this.isLoading = true;
            try {
              const res = await rmrkService?.resolve(
                rmrk,
                this.accountId,
                blockNumber
              );
              showNotification(
                `[TEXTILE] Entry ${index + 1} saved as ${res?._id}`,
                notificationTypes.success
              );
              console.log('res', index, res);
            } catch (e) {
              console.warn(`Failed Indexing ${index} with err ${e}`);
            }
            this.isLoading = false;
          }

          showNotification(
            `[TEXTILE] Saved ${remarks.length} entries`,
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
        }
      )
    );

    // check validity
    // PIN Image
    // Construct and pin JSON
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
      attributes: this.rmrkMint.tags,
      external_url: `https://nft.kodadot.xyz`,
      type: this.file.type
    };

    // TODO: upload file to IPFS
    const fileHash = await pinFile(this.file);

    if (!this.secondaryFileVisible) {
      this.meta.image = unSanitizeIpfsUrl(fileHash);
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
  }

  protected async canSupport() {
    if (this.hasSupport && this.file) {
      return [await supportTx(this.file)];
    }

    return [];
  }

  private toRemark(remark: string) {
    const { api } = Connector.getInstance();
    return api.tx.system.remark(remark);
  }

  protected loremIpfsum() {
    const { rmrkMint, accountId, version } = this;
    const res = NFTUtils.generateRemarks(rmrkMint, accountId, version);
    if (!Array.isArray(res)) {
      try {
        res.nfts.forEach(Consolidator.nftValid);
      } catch (e) {
        console.error('asd', e.message);
      }
    }

    (window as any).res = res;
  }

  private async submit() {
    this.isLoading = true;
    const { api } = Connector.getInstance();
    const rmrkService = getInstance();
    const mint = this.constructRmrkMint();
    if (!this.rmrkMint.metadata) {
      const meta = await this.constructMeta();
      mint.metadata = meta;
    }

    const mintString = `RMRK::MINT::${this.version}::${encodeURIComponent(
      JSON.stringify(mint)
    )}`;
    try {
      showNotification(mintString);
      console.log('submit', mintString);
      const cb = !this.hasSupport
        ? api.tx.system.remark
        : api.tx.utility.batchAll;
      const args = !this.hasSupport
        ? mintString
        : [this.toRemark(mintString), ...(await this.canSupport())];
      const tx = await exec(
        this.accountId,
        this.password,
        cb,
        [args],
        async result => {
          console.log(`Current status is`, result);
          if (result.status.isFinalized) {
            console.log(`finalized status is`, result);
            console.log(
              `Transaction finalized at blockHash ${result.status.asFinalized}`
            );
            execResultValue(tx);
            const header = await api.rpc.chain.getHeader(
              result.status.asFinalized
            );
            const persisted = await rmrkService?.resolve(
              mintString,
              this.accountId,
              header.number.toString()
            );
            console.log('SAVED', persisted?._id);
            showNotification(
              `[TEXTILE] ${persisted?._id}`,
              notificationTypes.success
            );
            this.isLoading = false;
          }
        }
      );
      console.warn('TX IN', tx);
      showNotification(`[CHAIN] Waiting to finalize block and save to TEXTILE`);
    } catch (e) {
      showNotification(`[ERR] ${e}`, notificationTypes.danger);
      console.error(e);
      this.isLoading = false;
    }
  }

  private upload(data: File) {
    console.log('upload', data.name);
    this.file = data;
  }
}
</script>
