import {
  Interaction,
  asSystemRemark,
  createMetadata,
  createMintInteaction,
  createMultipleNFT,
  unSanitizeIpfsUrl,
} from '@kodadot1/minimark'

import type { ActionMintToken } from './types'
import { canSupport } from '@/utils/support'
import { usePinningStore } from '@/stores/pinning'
import { pinFileToIPFS, pinJson } from '@/services/nftStorage'
import {
  nsfwAttribute,
  offsetAttribute,
  secondaryFileVisible,
} from '@/components/rmrk/Create/mintUtils'
import { IPFS_KODADOT_IMAGE_PLACEHOLDER } from '@/utils/constants'
import { preheatFileFromIPFS } from '@/utils/ipfs'
import { uploadDirectWhenMultiple } from '@/utils/directUpload'

import { basicUpdateFunction } from '@/components/unique/NftUtils'
import { usePreferencesStore } from '@/stores/preferences'
import { BaseMintedCollection } from '@/components/base/types'
import { Ref } from 'vue'
import { isRoyaltyValid } from '@/utils/royalty'
import { ExecuteTransactionParams } from '../useTransaction'

type RMRKMintedCollection = BaseMintedCollection & {
  name: string
  max: number
  symbol: string
}

type BSXMintedCollection = BaseMintedCollection & {
  lastIndexUsed: number
}
async function constructMeta(item: ActionMintToken): Promise<string> {
  const pinningStore = usePinningStore()
  const preferencesStore = usePreferencesStore()
  const { accountId } = useAuth()
  const { $consola } = useNuxtApp()
  const { file, name, description, secondFile, tags, nsfw } = item

  if (!file) {
    throw new ReferenceError('No file found!')
  }

  const { token } = await pinningStore.fetchPinningKey(accountId.value)
  const fileHash = await pinFileToIPFS(file, token)
  const secondFileHash = secondFile
    ? await pinFileToIPFS(secondFile, token)
    : undefined

  let imageHash: string | undefined = fileHash
  let animationUrl: string | undefined = undefined

  // if secondaryFileVisible(file) then assign secondaryFileHash to image and set animationUrl to fileHash
  if (secondaryFileVisible(file)) {
    animationUrl = fileHash
    imageHash = secondFileHash || IPFS_KODADOT_IMAGE_PLACEHOLDER
  }

  const attributes = [
    ...(tags || []),
    ...nsfwAttribute(nsfw),
    ...offsetAttribute(preferencesStore.getHasCarbonOffset),
  ]

  const meta = createMetadata(
    name,
    description,
    imageHash,
    animationUrl,
    attributes,
    'https://kodadot.xyz',
    file.type
  )

  const metaHash = await pinJson(meta, imageHash)
  preheatFileFromIPFS(fileHash)
  uploadDirectWhenMultiple(
    [file, secondFile],
    [fileHash, secondFileHash]
  ).catch($consola.warn)
  return unSanitizeIpfsUrl(metaHash)
}

async function execMintBasilisk(
  item: ActionMintToken,
  api,
  executeTransaction: (p: ExecuteTransactionParams) => void,
  metadataRef?: Ref<string | undefined>
) {
  const metadata = metadataRef?.value
    ? metadataRef.value
    : await constructMeta(item)
  const { selectedCollection, price, royalty, hasRoyalty } = item
  const {
    id: collectionId,
    alreadyMinted: collectionAlreadyMinted,
    lastIndexUsed,
  } = selectedCollection as BSXMintedCollection

  const cb = api.tx.utility.batchAll

  const nextId = Math.max(lastIndexUsed + 1, collectionAlreadyMinted + 1)
  const create = api.tx.nft.mint(collectionId, nextId, metadata)
  const list = price
    ? [api.tx.marketplace.setPrice(collectionId, nextId, price)]
    : []

  const addRoyalty =
    royalty !== undefined && isRoyaltyValid(royalty) && hasRoyalty
      ? [
          api.tx.marketplace.addRoyalty(
            collectionId,
            nextId,
            royalty.address,
            royalty.amount * 100
          ),
        ]
      : []

  const args = [[create, ...list, ...addRoyalty]]

  executeTransaction({
    cb,
    arg: args,
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
    onSuccess: item.onSuccess,
    onError: item.onError,
  })
}

async function execMintRmrk(
  item: ActionMintToken,
  api,
  executeTransaction: (p: ExecuteTransactionParams) => void
) {
  const { accountId } = useAuth()
  const { version } = useRmrkVersion()
  const preferences = usePreferencesStore()
  const metadata = await constructMeta(item)
  const { edition, name, postfix, selectedCollection } = item
  const { id: collectionId, alreadyMinted: collectionAlreadyMinted } =
    selectedCollection as RMRKMintedCollection

  const mint = createMultipleNFT(
    edition,
    accountId.value,
    collectionId,
    name,
    metadata,
    collectionAlreadyMinted,
    postfix && edition > 1 ? basicUpdateFunction : undefined
  )

  const mintInteraction = mint.map((nft) =>
    createMintInteaction(Interaction.MINTNFT, version, nft)
  )

  const enabledFees: boolean =
    preferences.getHasSupport || preferences.getHasCarbonOffset

  const feeMultiplier =
    Number(preferences.getHasSupport) +
    2 * Number(preferences.getHasCarbonOffset)

  const isSingle = mintInteraction.length === 1 && !enabledFees

  const cb = isSingle ? api.tx.system.remark : api.tx.utility.batchAll

  const args = isSingle
    ? [mintInteraction[0]]
    : [
        [
          ...mintInteraction.map((nft) => asSystemRemark(api, nft)),
          ...(await canSupport(api, enabledFees, feeMultiplier)),
        ],
      ]

  executeTransaction({
    cb,
    arg: args,
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
    onSuccess: item.onSuccess(mint),
    onError: item.onError,
  })
}

export async function execMintToken(
  item: ActionMintToken,
  api,
  executeTransaction: (p: ExecuteTransactionParams) => void
) {
  const metaData = ref<string>()

  if (item.urlPrefix === 'rmrk' || item.urlPrefix === 'rmrk2') {
    execMintRmrk(item, api, executeTransaction)
  }

  if (item.urlPrefix === 'snek' || item.urlPrefix === 'bsx') {
    execMintBasilisk(item, api, executeTransaction, metaData)
  }
}
