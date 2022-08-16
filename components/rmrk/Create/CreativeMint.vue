<template>
  <section>
    <br />
    <Loader v-model="isLoading" :status="status" />
    <p class="title is-size-3">
      <!-- {{ $t('mint.context') }} -->
      Creative Minting
    </p>
    <p class="subtitle is-size-7">{{ $t('general.using') }} {{ version }}</p>
    <b-field>
      <div>
        {{ $t('computed id') }}: <b>{{ rmrkId }}</b>
      </div>
    </b-field>
    <AuthField />

    <MetadataUpload
      v-model="file"
      label="Drop your NFT here or click to upload or simply paste image from clipboard. We support various media types (BMP, GIF, JPEG, PNG, SVG, TIFF, WEBP, MP4, OGV, QUICKTIME, WEBM, GLB, FLAC, MP3, JSON)"
      expanded
      preview />

    <LabeledText
      label="mint.nft.name.label"
      class="mb-2"
      :isLoading="isGptLoading">
      {{ rmrkMint.name }}
    </LabeledText>

    <LabeledText label="mint.nft.description.label" :isLoading="isGptLoading">
      {{ rmrkMint.description }}
    </LabeledText>

    <BasicNumberInput
      v-model="rmrkMint.max"
      key="edition"
      class="mt-5"
      :label="$t('mint.nft.edition.label')"
      :message="$t('mint.nft.edition.message')"
      :placeholder="$t('mint.nft.edition.placeholder')"
      expanded />

    <!-- <BalanceInput :step="0.1" @input="updateMeta" label="Price" expanded />
      <div class="content mt-3">
        <p>
          Hint: Setting the price now requires making an additional transaction.
        </p>
      </div> -->

    <SubmitButton
      label="mint.submit"
      :disabled="disabled"
      :loading="isLoading"
      @click="sub" />
  </section>
</template>

<script lang="ts">
import { DETAIL_TIMEOUT } from '@/utils/constants'
import { uploadDirect } from '@/utils/directUpload'
import { emptyObject } from '@/utils/empty'
import { askGpt } from '@/utils/gpt'
import AuthMixin from '@/utils/mixins/authMixin'
import ChainMixin from '@/utils/mixins/chainMixin'
import MetaTransactionMixin from '@/utils/mixins/metaMixin'
import RmrkVersionMixin from '@/utils/mixins/rmrkVersionMixin'
import UseApiMixin from '@/utils/mixins/useApiMixin'
import { pinFileToIPFS, pinJson, PinningKey } from '@/utils/nftStorage'
import { notificationTypes, showNotification } from '@/utils/notification'
import shouldUpdate from '@/utils/shouldUpdate'
import {
  basicUpdateNameFunction,
  createCollection,
  createMetadata,
  createMintInteaction,
  createMultipleNFT,
  Interaction,
  makeSymbol,
  mapAsSystemRemark,
  toCollectionId,
  unSanitizeIpfsUrl,
} from '@kodadot1/minimark'
import { Component, mixins, Watch } from 'nuxt-property-decorator'
import { getNftId, NFT, NFTMetadata, SimpleNFT } from '../service/scheme'
import { MediaType } from '../types'
import { resolveMedia, sanitizeIpfsUrl } from '../utils'

const components = {
  AuthField: () => import('@/components/shared/form/AuthField.vue'),
  MetadataUpload: () => import('./DropUpload.vue'),
  LabeledText: () => import('@/components/shared/gallery/LabeledText.vue'),
  SubmitButton: () => import('@/components/base/SubmitButton.vue'),
  BasicNumberInput: () =>
    import('@/components/shared/form/BasicNumberInput.vue'),
}

@Component<CreativeMint>({
  components,
})
export default class CreativeMint extends mixins(
  RmrkVersionMixin,
  MetaTransactionMixin,
  ChainMixin,
  AuthMixin,
  UseApiMixin
) {
  private rmrkMint: SimpleNFT = {
    ...emptyObject<SimpleNFT>(),
    max: 1,
    symbol: makeSymbol(),
    name: '~',
    description: '~',
  }
  private meta: NFTMetadata = emptyObject<NFTMetadata>()
  private file: File | null = null
  private price = 0
  private fileHash = ''
  private isGptLoading = false

  layout() {
    return 'centered-half-layout'
  }

  protected updateMeta(value: number): void {
    this.price = value
  }

  get fileType(): MediaType {
    return resolveMedia(this.file?.type)
  }

  get rmrkId(): string {
    return this.accountId
      ? toCollectionId(this.accountId, this.rmrkMint.symbol)
      : ''
  }

  get canCalculateTransactionFees(): boolean {
    const { name, symbol, max } = this.rmrkMint
    return !!(this.price && name && symbol && max)
  }

  get disabled(): boolean {
    const { name, symbol, max } = this.rmrkMint
    return !(name && symbol && max && this.accountId && this.file)
  }

  protected async sub(): Promise<void> {
    this.isLoading = true
    this.status = 'loader.ipfs'
    const api = await this.useApi()

    try {
      const meta = await this.constructMeta()
      this.rmrkMint.metadata = meta || ''

      const collection = createCollection(
        this.accountId,
        this.rmrkMint.symbol,
        this.rmrkMint.name,
        this.rmrkMint.metadata,
        0
      )

      const nftList = createMultipleNFT(
        this.rmrkMint.max,
        this.accountId,
        collection.id,
        this.rmrkMint.name,
        this.rmrkMint.metadata,
        0,
        basicUpdateNameFunction
      )

      const toRemark = mapAsSystemRemark(api)

      const collectionRemark = createMintInteaction(
        Interaction.MINT,
        this.version,
        collection
      )

      const mint = nftList.map((nft) =>
        createMintInteaction(Interaction.MINTNFT, this.version, nft)
      )

      const cb = api.tx.utility.batchAll
      const args = [toRemark(collectionRemark), ...mint.map(toRemark)]

      await this.howAboutToExecute(
        this.accountId,
        cb,
        [args],
        (blockNumber) => {
          showNotification(
            `[NFT] Saved ${this.rmrkMint.name} in block ${blockNumber}`,
            notificationTypes.success
          )
        }
      )
    } catch (e) {
      if (e instanceof Error) {
        showNotification(e.toString(), notificationTypes.danger)
        this.isLoading = false
      }
    }
  }

  public async constructMeta(): Promise<string | undefined> {
    const { file, rmrkMint } = this
    if (!file) {
      throw new ReferenceError('No file found!')
    }

    const { token }: PinningKey = await this.$store.dispatch(
      'pinning/fetchPinningKey',
      this.accountId
    )

    const fileHash = await pinFileToIPFS(file, token)

    let imageHash: string | undefined = fileHash
    let animationUrl: string | undefined = undefined

    const attributes = []

    const meta = createMetadata(
      rmrkMint.name,
      rmrkMint.description,
      imageHash,
      animationUrl,
      attributes,
      'https://kodadot.xyz',
      file.type
    )

    const metaHash = await pinJson(meta, imageHash)

    uploadDirect(file, metaHash).catch(this.$consola.warn)

    return unSanitizeIpfsUrl(metaHash)
  }

  protected navigateToDetail(nft: NFT, blockNumber: string) {
    showNotification(
      `You will go to the detail in ${DETAIL_TIMEOUT / 1000} seconds`
    )
    const go = () =>
      this.$router.push({
        path: `/rmrk/detail/${getNftId(nft, blockNumber)}`,
        query: { message: 'congrats' },
      })
    setTimeout(go, DETAIL_TIMEOUT)
  }

  @Watch('file')
  protected onFileChange(file: File | null, oldFile: File | null) {
    if (shouldUpdate(file, oldFile) && file) {
      this.uploadFile(file)
      this.fileHash = ''
    }
  }

  protected async uploadFile(file: File) {
    const { token }: PinningKey = await this.$store.dispatch(
      'pinning/fetchPinningKey',
      this.accountId
    )
    try {
      this.fileHash = await pinFileToIPFS(file, token)
      const url = sanitizeIpfsUrl(unSanitizeIpfsUrl(this.fileHash))
      this.isGptLoading = true
      const { title, description } = await askGpt(url)
      this.$set(this.rmrkMint, 'name', title)
      this.$set(this.rmrkMint, 'description', description)
      this.isGptLoading = false
    } catch (e) {
      this.$consola.error(e)
      this.isGptLoading = false
    }
  }
}
</script>
