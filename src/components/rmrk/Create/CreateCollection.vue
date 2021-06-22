<template>
  <div>
    <b-loading is-full-page v-model="isLoading" :can-cancel="true"></b-loading>
    <div class="box">
      <p class="title is-size-3">
        {{ $t("context") }}
      </p>
      <p class="subtitle is-size-7">{{ $t("using") }} {{ version }}</p>
      <b-field>
        <div>
          {{ $t("computed id") }}: <b>{{ rmrkId }}</b>
        </div>
      </b-field>
      <b-field >
        <Auth />
      </b-field>

      <MetadataUpload
        v-model="image"
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
      <b-field>
        <b-switch v-model="unlimited" :rounded="false">
          {{ $t("mint.unlimited") }}
        </b-switch>
      </b-field>
      <b-field v-if="!unlimited" :label="$i18n.t('Maximum NFTs in collection')">
        <b-numberinput
          v-model="rmrkMint.max"
          placeholder="1 is minumum"
          :min="1"
        ></b-numberinput>
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
          {{ $t("create collection") }}
        </b-button>
      </b-field>
      <b-field>
        <Support v-model="hasSupport" :price="filePrice" />
      </b-field>
    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Mixins } from 'vue-property-decorator';
import { emptyObject } from '@/utils/empty';

import Connector from '@vue-polkadot/vue-api';
import exec, { execResultValue } from '@/utils/transactionExecutor';
import { notificationTypes, showNotification } from '@/utils/notification';
import SubscribeMixin from '@/utils/mixins/subscribeMixin';
import RmrkVersionMixin from '@/utils/mixins/rmrkVersionMixin';

import { getInstance, RmrkType } from '../service/RmrkService';
import { Collection, CollectionMetadata } from '../service/scheme';
import { unSanitizeIpfsUrl } from '@/utils/ipfs';
import { pinFile, pinJson } from '@/proxy';
import { decodeAddress } from '@polkadot/keyring';
import { u8aToHex } from '@polkadot/util';
import { generateId } from '@/components/rmrk/service/Consolidator';
import { supportTx, calculateCost } from '@/utils/support';

const components = {
  Auth: () => import('@/components/shared/Auth.vue'),
  MetadataUpload: () => import('./DropUpload.vue'),
  PasswordInput: () => import('@/components/shared/PasswordInput.vue'),
  Tooltip: () => import('@/components/shared/Tooltip.vue'),
  Support: () => import('@/components/shared/Support.vue'),
};

@Component({ components })
export default class CreateCollection extends Mixins(
  SubscribeMixin,
  RmrkVersionMixin
) {
  private rmrkMint: Collection = emptyObject<Collection>();
  private meta: CollectionMetadata = emptyObject<CollectionMetadata>();
  // private accountId: string = '';
  private uploadMode: boolean = true;
  private image: Blob | null = null;
  private isLoading: boolean = false;
  private password: string = '';
  private hasSupport: boolean = true;
  protected unlimited: boolean = true;

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
    return !(name && symbol && max && this.accountId && this.image);
  }

  public constructRmrkMint(): Collection {
    const mint: Collection = {
      ...this.rmrkMint,
      symbol: this.rmrkMint.symbol.trim().toUpperCase(),
      version: this.version,
      issuer: this.accountId,
      metadata: unSanitizeIpfsUrl(this.rmrkMint?.metadata),
      id: this.rmrkId
    };

    return mint;
  }

  get filePrice() {
    return calculateCost(this.image);
  }

  public async constructMeta() {
    if (!this.image) {
      throw new ReferenceError('No file found!');
    }

    this.meta = {
      ...this.meta,
      attributes: [],
      external_url: `https://rmrk.app/registry/${this.rmrkId}`
    };

    // TODO: upload image to IPFS
    const imageHash = await pinFile(this.image);
    this.meta.image = unSanitizeIpfsUrl(imageHash);
    // TODO: upload meta to IPFS
    const metaHash = await pinJson(this.meta);

    return unSanitizeIpfsUrl(metaHash);
  }

  protected async canSupport() {
    if (this.hasSupport && this.image) {
      return [await supportTx(this.image)];
    }

    return [];
  }

  private toRemark(remark: string) {
    const { api } = Connector.getInstance();
    return api.tx.system.remark(remark);
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
    this.image = data;
  }
}
</script>
