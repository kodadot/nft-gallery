<template>
  <section>
    <Loader v-model="isLoading" :status="status" />
    <h1 class="title is-size-3">Create NFT Collectibles</h1>
    <p class="subtitle is-size-7">{{ $t('general.using') }} {{ version }}</p>

    <div class="py-2">
      {{ $t('computed id') }}: <b>{{ rmrkId }}</b>
    </div>

    <Auth />

    <DropUpload
      ref="nftUpload"
      v-model="file"
      required
      :label="$t('mint.nft.drop')"
      expanded
      preview
      data-cy="input-upload" />

    <BasicInput
      ref="nftNameInput"
      v-model="rmrkMint.name"
      required
      :label="$t('mint.nft.name.label')"
      :message="$t('mint.nft.name.message')"
      :placeholder="$t('mint.nft.name.placeholder')"
      expanded
      spellcheck="true"
      data-cy="input-name"
      @blur.native.capture="generateSymbol" />

    <BasicInput
      ref="nftSymbolInput"
      v-model="rmrkMint.symbol"
      required
      :label="$t('mint.collection.symbol.label')"
      :message="$t('mint.collection.symbol.message')"
      :placeholder="$t('mint.collection.symbol.placeholder')"
      maxlength="10"
      expanded
      data-cy="input-symbol"
      @keydown.native.space.prevent />

    <BasicInput
      v-model="meta.description"
      maxlength="500"
      type="textarea"
      spellcheck="true"
      class="mb-0 mt-5"
      :label="$t('mint.nft.description.label')"
      :message="$t('mint.nft.description.message')"
      :placeholder="$t('mint.nft.description.placeholder')"
      data-cy="input-description" />

    <NeoField
      :label="$t('mint.nft.edition.label')"
      class="mt-5"
      data-cy="input-edition">
      <NeoInput
        v-model="rmrkMint.max"
        type="number"
        :placeholder="$t('mint.nft.edition.placeholder')"
        expanded
        :min="1" />
    </NeoField>

    <DropUpload
      v-if="isSecondaryFileVisible"
      v-model="secondFile"
      label="Your NFT requires a poster/cover to be seen in gallery. Please upload image (jpg/ png/ gif)"
      icon="file-image"
      accept="image/png, image/jpeg, image/gif"
      expanded
      preview />

    <AttributeTagInput
      v-model="rmrkMint.tags"
      placeholder="Get discovered easier through tags"
      data-cy="input-tags" />

    <BalanceInput
      :step="0.1"
      label="Price"
      expanded
      data-cy="input-price"
      @input="updateMeta" />

    <div class="content mt-3">
      <p>
        Hint: Setting the price now requires making an additional transaction.
      </p>
    </div>

    <NeoField>
      <CollapseWrapper
        v-if="rmrkMint.max > 1"
        visible="mint.expert.show"
        hidden="mint.expert.hide"
        data-cy="input-advance-settings">
        <p class="title is-6" data-cy="input-valid-address">
          {{ $t('mint.expert.count', [parseAddresses.length]) }}
        </p>
        <p v-show="syncVisible" class="sub-title is-6 has-text-warning">
          {{ $t('mint.expert.countGlitch', [parseAddresses.length]) }}
        </p>
        <NeoField :label="$t('mint.expert.batchSend')">
          <NeoInput
            v-model="batchAddresses"
            type="textarea"
            :placeholder="'Distribute NFTs to multiple addresses like this:\n- HjshJ....3aJk\n- FswhJ....3aVC\n- HjW3J....9c3V'"
            spellcheck="true"
            data-cy="input-batch-address" />
        </NeoField>

        <NeoField class="mt-4" :label="$t('action.distributionCount')">
          <NeoSlider
            v-model="distribution"
            data-cy="input-distribution"
            :min="0"
            :max="100" />
        </NeoField>
        <NeoField v-show="syncVisible">
          <NeoButton
            no-shadow
            icon-left="sync"
            variant="warning"
            @click.native="syncEdition">
            {{ $t('mint.expert.sync', [actualDistribution]) }}
          </NeoButton>
        </NeoField>
        <BasicSwitch
          v-model="random"
          label="action.random"
          data-cy="input-random" />
        <BasicSwitch
          v-model="postfix"
          label="mint.expert.postfix"
          data-cy="input-hashtag" />
      </CollapseWrapper>
    </NeoField>
    <BasicSwitch v-model="nsfw" label="mint.nfsw" data-cy="input-nsfw" />
    <NeoField variant="danger" :message="haveNoToSMessage">
      <NeoSwitch v-model="hasToS" :rounded="false" data-cy="input-tos">
        {{ $t('termOfService.accept') }}
      </NeoSwitch>
    </NeoField>
    <NeoField
      v-if="isLogIn"
      type="is-danger"
      :message="balanceNotEnoughMessage">
      <SubmitButton
        expanded
        label="mint.submit"
        :loading="isLoading"
        @click="sub()" />
    </NeoField>
    <NeoField>
      <NeoIcon icon="calculator" />
      <span class="pr-2">{{ $t('mint.estimated') }}</span>
      <BasicMoney :value="estimated" inline data-cy="fee" />
      <span class="pl-2"> ({{ getUsdFromKsm().toFixed(2) }} USD) </span>
    </NeoField>
  </section>
</template>

<script lang="ts" setup>
import {
  sendFunction,
  shuffleFunction,
  toDistribute,
} from '@/components/accounts/utils'
import {
  isFileWithoutType,
  isSecondFileVisible,
  nsfwAttribute,
  offsetAttribute,
  secondaryFileVisible,
} from '@/utils/mintUtils'
import { generateId } from '@/components/rmrk/service/Consolidator'
import collectionList from '@/queries/subsquid/rmrk/usedCollectionSymbolsByAccount.graphql'
import {
  DETAIL_TIMEOUT,
  IPFS_KODADOT_IMAGE_PLACEHOLDER,
} from '@/utils/constants'
import { uploadDirectWhenMultiple } from '@/utils/directUpload'
import { emptyObject } from '@/utils/empty'
import { pinFileToIPFS, pinJson } from '@/services/nftStorage'
import { notificationTypes, showNotification } from '@/utils/notification'
import correctFormat from '@/utils/ss58Format'
import { canSupport, feeTx } from '@/utils/support'
import exec, {
  estimate,
  execResultValue,
  txCb,
} from '@/utils/transactionExecutor'
import { Interaction, createInteraction } from '@kodadot1/minimark/v1'
import { mapAsSystemRemark } from '@kodadot1/minimark/common'
import { createMetadata, unSanitizeIpfsUrl } from '@kodadot1/minimark/utils'
import { findUniqueSymbol } from '@kodadot1/minimark/shared'
import { DispatchError } from '@polkadot/types/interfaces'
import { formatBalance } from '@polkadot/util'
import { encodeAddress, isAddress } from '@polkadot/util-crypto'
import { unwrapSafe } from '@/utils/uniquery'
import NFTUtils, { MintType } from '../service/NftUtils'
import {
  NFTMetadata,
  RmrkCreatedNft,
  SimpleNFT,
  toNFTId,
} from '../service/scheme'
import { resolveMedia } from '../utils'
import { useFiatStore } from '@/stores/fiat'
import { usePinningStore } from '@/stores/pinning'
import { usePreferencesStore } from '@/stores/preferences'
import {
  NeoButton,
  NeoField,
  NeoIcon,
  NeoInput,
  NeoSlider,
  NeoSwitch,
} from '@kodadot1/brick'
import BasicInput from '@/components/shared/form/BasicInput.vue'
import BasicSwitch from '@/components/shared/form/BasicSwitch.vue'
import SubmitButton from '@/components/base/SubmitButton.vue'
import BasicMoney from '@/components/shared/format/BasicMoney.vue'
import AttributeTagInput from './AttributeTagInput.vue'
import { useIdentityStore } from '@/stores/identity'

const { $i18n, $consola, $apollo } = useNuxtApp()
const router = useRouter()
const { apiInstance } = useApi()
const { accountId } = useAuth()
const { chainProperties, decimals, unit } = useChain()
const { client } = usePrefix()
const { isLoading, status, resolveStatus } = useTransactionStatus()
const { isLogIn } = useAuth()
const fiatStore = useFiatStore()
const pinningStore = usePinningStore()
const preferencesStore = usePreferencesStore()
const identityStore = useIdentityStore()
const { version } = useRmrkVersion()

const rmrkMint = ref({
  ...emptyObject<SimpleNFT>(),
  max: 1,
})
const meta = ref(emptyObject<NFTMetadata>())
const file = ref<File | null>(null)
const secondFile = ref<File | null>(null)
const hasToS = ref(false)
const nsfw = ref(false)
const price = ref(0)
const estimated = ref('')
const batchAddresses = ref('')
const postfix = ref(true)
const random = ref(false)
const distribution = ref(100)
const first = ref(100)
const usedCollectionSymbols = ref<string[]>([])
const balanceNotEnough = ref(false)
const haveNoToS = ref(false)
const nftUpload = ref()
const nftNameInput = ref()
const nftSymbolInput = ref()

const balanceNotEnoughMessage = computed(() =>
  balanceNotEnough.value ? $i18n.t('tooltip.notEnoughBalance') : ''
)
const haveNoToSMessage = computed(() =>
  haveNoToS.value ? $i18n.t('tooltip.haveNoToS') : ''
)
const fileType = computed(() => resolveMedia(file.value?.type))
const isSecondaryFileVisible = computed(
  () =>
    isFileWithoutType(file.value, fileType.value) ||
    isSecondFileVisible(fileType.value)
)
const rmrkId = computed(() =>
  generateId(accountId.value, rmrkMint.value?.symbol || '')
)
const canCalculateTransactionFees = computed(
  () =>
    !!(
      price.value &&
      rmrkMint.value.name &&
      rmrkMint.value.symbol &&
      rmrkMint.value.max
    )
)
const hasSupport = computed(() => preferencesStore.hasSupport)
const hasCarbonOffset = computed({
  get: () => preferencesStore.getHasCarbonOffset,
  set: (value: boolean) => preferencesStore.setHasCarbonOffset(value),
})

const ss58Format = computed(() => chainProperties.value?.ss58Format)
const parseAddresses = computed(() => {
  const addresses = batchAddresses.value
    .split('\n')
    .map((x) => x.split('-'))
    .filter((x) => x.length)
    .map((x) => x[1])
    .filter(Boolean)
    .map((a) => a.trim())
  const onlyValid = addresses
    .filter((a) => isAddress(a))
    .map((a) => encodeAddress(a, correctFormat(ss58Format.value)))

  return onlyValid
})
const syncVisible = computed(
  () => rmrkMint.value.max < actualDistribution.value
)
const actualDistribution = computed(() =>
  toDistribute(parseAddresses.value.length, distribution.value)
)
const balance = computed(() => identityStore.getAuthBalance)
const isMintDisabled = computed(
  () => Number(balance.value) < Number(estimated.value)
)

// query for nfts information by accountId
$apollo
  .watchQuery({
    query: collectionList,
    client: client.value,
    variables: {
      account: accountId.value,
      first: first.value,
    },
    fetchPolicy: 'cache-and-network',
  })
  .subscribe((data) => {
    const collectionEntities = data?.data?.collectionEntities
    if (collectionEntities) {
      usedCollectionSymbols.value = unwrapSafe(collectionEntities).map(
        ({ symbol }) => symbol
      )
    }
  })

// set symbol name
function generateSymbol(): void {
  if (!rmrkMint.value?.symbol && rmrkMint.value.name?.length) {
    const symbol = generateSymbolCore(
      rmrkMint.value.name,
      usedCollectionSymbols.value
    )

    rmrkMint.value.symbol = symbol
  }
}

// core: to generate symbol
function generateSymbolCore(name: string, usedSymbols: string[]): string {
  let symbol = name.replaceAll(' ', '_')
  symbol = findUniqueSymbol(symbol, usedSymbols)
  return symbol.slice(0, 10).toUpperCase() // symbol's length have to smaller than 10
}

function updateMeta(value: number): void {
  price.value = value

  if (canCalculateTransactionFees.value) {
    estimateTx()
  }
}

function checkValidity() {
  return (
    nftUpload.value.checkValidity() &&
    nftNameInput.value.checkValidity() &&
    nftSymbolInput.value.checkValidity()
  )
}

async function estimateTx() {
  if (!version.value) {
    return
  }

  const api = await apiInstance.value
  const toRemark = mapAsSystemRemark(api)
  const result = NFTUtils.generateRemarks(
    rmrkMint.value,
    accountId.value,
    version.value
  )
  const cb = api.tx.utility.batchAll
  const remarks: string[] = Array.isArray(result)
    ? result
    : [
        NFTUtils.toString(result.collection, version.value),
        ...result.nfts.map((nft) => NFTUtils.toString(nft, version.value)),
      ]

  const args = !hasSupport.value
    ? remarks.map(toRemark)
    : [
        ...remarks.map(toRemark),
        ...(await canSupport(api, hasSupport.value, 3)),
      ]

  estimated.value = await estimate(accountId.value, cb, [args])
}

function syncEdition(): void {
  rmrkMint.value.max = actualDistribution.value
}

async function sub(): Promise<void> {
  if (!checkValidity()) {
    return
  }
  if (!hasToS.value) {
    haveNoToS.value = true
    return
  }
  if (isMintDisabled.value) {
    balanceNotEnough.value = true
    return
  }
  isLoading.value = true
  status.value = 'loader.ipfs'

  if (!version.value) {
    return
  }

  rmrkMint.value.max = Number(rmrkMint.value.max)
  const api = await apiInstance.value
  const toRemark = mapAsSystemRemark(api)

  try {
    const meta = await constructMeta()
    rmrkMint.value.metadata = meta || ''

    const result = NFTUtils.generateRemarks(
      rmrkMint.value,
      accountId.value,
      version.value,
      false,
      postfix.value && rmrkMint.value.max > 1
        ? (name: string, index: number) => `${name} #${index + 1}`
        : undefined
    ) as MintType

    const cb = api.tx.utility.batchAll
    const remarks: string[] = Array.isArray(result)
      ? result
      : [
          NFTUtils.toString(result.collection, version.value),
          ...result.nfts.map((nft) => NFTUtils.toString(nft, version.value)),
        ]

    const args = !hasSupport.value
      ? remarks.map(toRemark)
      : [
          ...remarks.map(toRemark),
          ...(await canSupport(api, hasSupport.value, 3)),
        ]

    const tx = await exec(
      accountId.value,
      '',
      cb,
      [args],
      txCb(
        async (blockHash) => {
          execResultValue(tx)
          const header = await api.rpc.chain.getHeader(blockHash)
          const blockNumber = header.number.toString()

          if (batchAddresses.value) {
            sendBatch(result.nfts, blockNumber)
          } else if (price.value) {
            listForSale(result.nfts, blockNumber)
          } else {
            navigateToDetail(result.nfts[0], blockNumber)
          }

          showNotification(
            `[NFT] Saved ${rmrkMint.value.max} entries in block ${blockNumber}`,
            notificationTypes.success
          )

          if (!batchAddresses.value || !price.value) {
            isLoading.value = false
          }
        },
        (dispatchError) => {
          execResultValue(tx)
          onTxError(dispatchError)
          isLoading.value = false
        },
        (res) => resolveStatus(res.status)
      )
    )
  } catch (e) {
    if (e instanceof Error) {
      showNotification(e.toString(), notificationTypes.warn)
      isLoading.value = false
    }
  }
}

async function fetchRandomSeed(): Promise<number[]> {
  const api = await apiInstance.value
  const random = await api.query.babe.randomness()
  return Array.from(random)
}

async function sendBatch(
  remarks: RmrkCreatedNft[],
  originalBlockNumber: string
): Promise<void> {
  try {
    // TODO: WORK WITH V2
    const addresses = parseAddresses.value
    showNotification(`[APP] Sending NFTs to ${addresses.length} addresses`)

    const onlyNfts = remarks
      .filter(NFTUtils.isNFT)
      .map((nft) => ({ ...nft, id: toNFTId(nft, originalBlockNumber) }))
    // .map(nft =>
    //   NFTUtils.createInteraction('SEND', version, nft.id, String(price))
    // )

    if (!onlyNfts.length) {
      showNotification('Can not send empty NFTs', notificationTypes.warn)
      return
    }

    const api = await apiInstance.value
    const toRemark = mapAsSystemRemark(api)
    const outOfTheNamesForTheRemarks = sendFunction(
      addresses,
      distribution.value,
      random.value ? shuffleFunction(await fetchRandomSeed()) : undefined
    )(onlyNfts.map((nft) => nft.id))
    const restOfTheRemarks =
      onlyNfts.length > addresses.length && price.value
        ? onlyNfts
            .slice(outOfTheNamesForTheRemarks.length)
            .map((nft) =>
              createInteraction(Interaction.LIST, nft.id, String(price.value))
            )
        : []

    isLoading.value = true

    const cb = api.tx.utility.batchAll
    const args = [...outOfTheNamesForTheRemarks, ...restOfTheRemarks].map(
      toRemark
    )

    const estimatedFee = await estimate(accountId.value, cb, [args])
    const support = feeTx(api, estimatedFee)
    args.push(support)

    const tx = await exec(
      accountId.value,
      '',
      cb,
      [args],
      txCb(
        async (blockHash) => {
          execResultValue(tx)
          const header = await api.rpc.chain.getHeader(blockHash)
          const blockNumber = header.number.toString()

          showNotification(
            `[SEND] Saved prices for ${
              rmrkMint.value.max
            } NFTs with tag ${formatBalance(price.value, {
              decimals: decimals.value,
              withUnit: unit.value,
            })} in block ${blockNumber}`,
            notificationTypes.success
          )

          isLoading.value = false
          const firstNft = remarks.find(NFTUtils.isNFT)

          if (firstNft) {
            navigateToDetail(firstNft, originalBlockNumber)
          }
        },
        (dispatchError) => {
          execResultValue(tx)
          onTxError(dispatchError)
          isLoading.value = false
        }
      )
    )
  } catch (e) {
    if (e instanceof Error) {
      showNotification(e.message, notificationTypes.warn)
      isLoading.value = false
    }
  }
}

async function onTxError(dispatchError: DispatchError): Promise<void> {
  const api = await apiInstance.value
  if (dispatchError.isModule) {
    const decoded = api.registry.findMetaError(dispatchError.asModule)
    const { docs, name, section } = decoded
    showNotification(
      `[ERR] ${section}.${name}: ${docs.join(' ')}`,
      notificationTypes.warn
    )
  } else {
    showNotification(
      `[ERR] ${dispatchError.toString()}`,
      notificationTypes.warn
    )
  }

  isLoading.value = false
}

async function listForSale(
  remarks: RmrkCreatedNft[],
  originalBlockNumber: string
) {
  try {
    showNotification(
      `[APP] Listing NFT to sale for ${formatBalance(price.value, {
        decimals: decimals.value,
        withUnit: unit.value,
      })}`
    )

    const onlyNfts = remarks
      .filter(NFTUtils.isNFT)
      .map((nft) => ({ ...nft, id: toNFTId(nft, originalBlockNumber) }))
      .map((nft) =>
        createInteraction(Interaction.LIST, nft.id, String(price.value))
      )

    if (!onlyNfts.length) {
      showNotification('Can not list empty NFTs', notificationTypes.warn)
      return
    }

    isLoading.value = true
    const api = await apiInstance.value
    const toRemark = mapAsSystemRemark(api)

    const cb = api.tx.utility.batchAll
    const args = onlyNfts.map(toRemark)

    const tx = await exec(
      accountId.value,
      '',
      cb,
      [args],
      txCb(
        async (blockHash) => {
          execResultValue(tx)
          const header = await api.rpc.chain.getHeader(blockHash)
          const blockNumber = header.number.toString()

          showNotification(
            `[LIST] Saved prices for ${
              rmrkMint.value.max
            } NFTs with tag ${formatBalance(price.value, {
              decimals: decimals.value,
              withUnit: unit.value,
            })} in block ${blockNumber}`,
            notificationTypes.success
          )

          isLoading.value = false
          const firstNft = remarks.find(NFTUtils.isNFT)

          if (firstNft) {
            navigateToDetail(firstNft, originalBlockNumber)
          }
        },
        (dispatchError) => {
          execResultValue(tx)
          onTxError(dispatchError)
          isLoading.value = false
        }
      )
    )
  } catch (e) {
    if (e instanceof Error) {
      showNotification(e.message, notificationTypes.warn)
      isLoading.value = false
    }
  }
}

async function constructMeta(): Promise<string | undefined> {
  const m = meta.value
  if (!file.value) {
    throw new ReferenceError('No file found!')
  }
  const { token } = await pinningStore.fetchPinningKey(accountId.value)

  const fileHash = await pinFileToIPFS(file.value, token)
  const secondFileHash = secondFile.value
    ? await pinFileToIPFS(secondFile.value, token)
    : undefined

  let imageHash: string | undefined = fileHash
  let animationUrl: string | undefined = undefined

  // if secondaryFileVisible(file) then assign secondaryFileHash to image and set animationUrl to fileHash
  if (secondaryFileVisible(file.value)) {
    animationUrl = fileHash
    imageHash = secondFileHash || IPFS_KODADOT_IMAGE_PLACEHOLDER
  }

  const attributes = [
    ...nsfwAttribute(nsfw.value),
    ...offsetAttribute(hasCarbonOffset.value),
  ]

  const newMeta = createMetadata(
    rmrkMint.value.name,
    m.description || '',
    imageHash,
    animationUrl,
    attributes,
    'https://kodadot.xyz',
    file.value.type
  )

  const metaHash = await pinJson(newMeta, imageHash)

  uploadDirectWhenMultiple(
    [file.value, secondFile.value],
    [fileHash, secondFileHash]
  ).catch($consola.warn)
  return unSanitizeIpfsUrl(metaHash)
}

function navigateToDetail(nft: RmrkCreatedNft, blockNumber: string) {
  showNotification(
    `You will go to the detail in ${DETAIL_TIMEOUT / 1000} seconds`
  )
  const go = () =>
    router.push({
      path: `/rmrk/gallery/${toNFTId(nft, blockNumber)}`,
      query: { congratsNft: nft.name },
    })
  setTimeout(go, DETAIL_TIMEOUT)
}

function getUsdFromKsm() {
  const KSMVal = formatBalance(estimated.value, {
    decimals: decimals.value,
    withUnit: false,
    forceUnit: '-',
  })

  return Number(fiatStore.getCurrentKSMValue) * Number(KSMVal)
}

watch(
  rmrkMint,
  () => {
    if (canCalculateTransactionFees.value) {
      estimateTx()
    }
  },
  { deep: true }
)
</script>
