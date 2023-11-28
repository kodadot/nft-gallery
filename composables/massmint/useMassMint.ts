/* eslint-disable @typescript-eslint/no-unused-vars */

import { unwrapSafe } from '@/utils/uniquery'
import resolveQueryPath from '@/utils/queryPathResolver'
import { NFTToMint, Status } from '@/components/massmint/types'
import { Interaction } from '@kodadot1/minimark/v1'
import { MintedCollection, TokenToMint } from '@/composables/transaction/types'
import {
  createTokensToMint,
  kusamaMintAndList,
  subscribeToCollectionLengthUpdates,
} from './massMintHelpers'
import nftStorageApi from '~/services/nftStorage'
import { createMetadata, unSanitizeIpfsUrl } from '@kodadot1/minimark/utils'
import { FetchError } from 'ofetch'

export const statusTranslation = (status?: Status): string => {
  const { $i18n } = useNuxtApp()
  const statusTranslationMap: Record<Status, string> = {
    [Status.Ok]: $i18n.t('ok'),
    [Status.Incomplete]: $i18n.t('incomplete'),
    [Status.Description]: $i18n.t('description'),
    [Status.Price]: $i18n.t('price'),
    [Status.Optional]: $i18n.t('optional'),
  }
  return status ? statusTranslationMap[status] : ''
}

export const statusClass = (status?: Status) => {
  const statusMap: Record<Status, string> = {
    [Status.Ok]: 'k-greenaccent',
    [Status.Incomplete]: 'k-redaccent',
    [Status.Description]: 'k-yellow',
    [Status.Price]: 'k-yellow',
    [Status.Optional]: 'k-yellow',
  }

  return status ? statusMap[status] : ''
}

export const useCollectionForMint = () => {
  const collectionsEntites = ref<MintedCollection[]>()
  const collections = ref()
  const { $consola } = useNuxtApp()
  const { accountId, isLogIn } = useAuth()
  const { client, urlPrefix } = usePrefix()
  const queryPath = {
    rmrk: 'chain-rmrk',
    ksm: 'chain-rmrk',
  }

  const doFetch = async () => {
    if (!isLogIn.value) {
      return
    }

    const prefix = queryPath[urlPrefix.value] || urlPrefix.value
    const query = await resolveQueryPath(prefix, 'collectionForMint')
    const { data } = await useAsyncQuery({
      query: query.default,
      variables: {
        account: accountId.value,
      },
      clientId: client.value,
    })

    const { collectionEntities } = data.value

    collections.value = collectionEntities
      .map((collection) => ({
        ...collection,
        lastIndexUsed: Math.max(
          ...collection.nfts.map((nft) => Number(nft.index)),
        ),

        alreadyMinted: collection.nfts?.length,
        totalCount: collection.nfts?.filter((nft) => !nft.burned).length,
      }))
      .filter(
        (collection) =>
          (collection.max || Infinity) - collection.alreadyMinted > 0,
      )
  }

  const doFetchWithErrorHandling = () =>
    doFetch().catch((error) => {
      $consola.error(
        `Error fetching collections for account ${accountId.value}:`,
        error,
      )
    })

  watch(accountId, doFetchWithErrorHandling, { immediate: true })

  watch(collections, () => {
    if (!collections) {
      $consola.log(`collections for account ${accountId.value} not found`)
      return
    }

    collectionsEntites.value = unwrapSafe(collections.value)
  })

  return {
    collectionsEntites,
  }
}

export const useMassMint = (
  nfts: NFTToMint[],
  collection: MintedCollection,
) => {
  const { blockNumber, transaction, isLoading, status, isError } =
    useTransaction()
  const collectionUpdated = ref(false)
  const { urlPrefix } = usePrefix()
  const { isRemark } = useIsChain(urlPrefix)

  const tokens = createTokensToMint(nfts, collection)

  const simpleMint = () => {
    transaction({
      interaction: Interaction.MINTNFT,
      urlPrefix: urlPrefix.value,
      token: tokens,
    })

    watch(subscribeToCollectionLengthUpdates(collection.id), (isDone) => {
      collectionUpdated.value = isDone
    })
  }

  const willItList = tokens.some(
    (token) => token.price && Number(token.price) > 0,
  )

  if (willItList && isRemark.value) {
    const mintAndListResults = kusamaMintAndList(tokens)
    watchEffect(() => {
      collectionUpdated.value = mintAndListResults.collectionUpdated.value
      isLoading.value = mintAndListResults.isLoading.value
      status.value = mintAndListResults.status.value
      blockNumber.value = mintAndListResults.blockNumber.value
      isError.value = mintAndListResults.isError.value
    })
  } else {
    // simpleMint()
    constructMeta(tokens)
  }
  return {
    blockNumber,
    isLoading,
    status,
    collectionUpdated,
    isError,
  }
}

function getFileSuffix(filename: string): string {
  return filename.split('.').pop() as string
}

export const pinDirectory = async (files: File[]): Promise<string> => {
  const formData = new FormData()
  files.forEach((file) => formData.append('file', file, file.name))

  const response = await nftStorageApi('/pinFile', {
    method: 'POST',
    body: formData,
  }).catch((error: FetchError) => {
    throw new Error(
      `[NFT::STORAGE] Unable to PIN Directory for reasons ${error.data}`,
    )
  })

  const directoryCid = response.value.cid
  return directoryCid
}

function createFilesFromTokens(tokensToMint: TokenToMint[]): File[] {
  return tokensToMint.map((token, index) => {
    if (!token.file) {
      throw new ReferenceError('No file found for token index ' + index)
    }
    const suffix = getFileSuffix(token.file.name)
    return new File([token.file], `${index}.${suffix}`)
  })
}

function batchFiles(files: File[], maxBatchSize: number): File[][] {
  let currentBatch: File[] = []
  let currentBatchSize = 0
  const batches: File[][] = []

  const startNewBatch = (file: File) => {
    currentBatch = [file]
    currentBatchSize = file.size
  }

  for (const file of files) {
    if (currentBatchSize + file.size > maxBatchSize) {
      batches.push(currentBatch)
      startNewBatch(file)
    } else {
      currentBatch.push(file)
      currentBatchSize += file.size
    }
  }

  if (currentBatch.length > 0) {
    batches.push(currentBatch)
  }

  return batches
}

export async function uploadImages(
  tokensToMint: TokenToMint[],
): Promise<string[]> {
  const MAX_BATCH_SIZE = 100 * 1024 * 1024 // 100 MB in bytes
  const files = createFilesFromTokens(tokensToMint)
  const fileBatches = batchFiles(files, MAX_BATCH_SIZE)

  const directoryCIDs = await Promise.all(fileBatches.map(pinDirectory))

  return directoryCIDs.flatMap((directoryCid, batchIndex) =>
    fileBatches[batchIndex].map(
      (file, fileIndex) =>
        `ipfs://${directoryCid}/${fileIndex}.${getFileSuffix(file.name)}`,
    ),
  )
}

function createTokenMetadata(
  token: TokenToMint,
  primaryHash: string,
  enableCarbonOffset: boolean,
  index: number,
): File {
  const preferencesStore = usePreferencesStore()
  const { name, description, tags, nsfw, file } = token
  const attributes = [
    ...(tags || []),
    ...nsfwAttribute(nsfw),
    ...(enableCarbonOffset
      ? offsetAttribute(preferencesStore.getHasCarbonOffset)
      : []),
  ]

  const meta = createMetadata(
    name,
    description,
    primaryHash,
    undefined,
    attributes,
    'https://kodadot.xyz',
    (file as File).type,
  )

  return new File([JSON.stringify(meta, null, 2)], `${index}.json`, {
    type: 'application/json',
  })
}

async function preheatAndUploadFiles(
  token: TokenToMint,
  primaryHash: string,
): Promise<void> {
  const { $consola } = useNuxtApp()
  preheatFileFromIPFS(primaryHash)
  const filePair: [File, File | null] = [token.file as File, null]
  const hashPair: [string, string | undefined] = [primaryHash, undefined]
  await uploadDirectWhenMultiple(filePair, hashPair).catch($consola.warn)
}

export async function constructMeta(
  tokensToMint: TokenToMint[],
  options?: {
    enableCarbonOffset?: boolean
  },
): Promise<string[]> {
  const { enableCarbonOffset = false } = options || {}
  const imageHashes = await uploadImages(tokensToMint)

  // Create metadata files
  const metadataFiles = tokensToMint.map((token, index) => {
    const imageHash = imageHashes[index]
    return createTokenMetadata(token, imageHash, enableCarbonOffset, index)
  })

  // Upload all metadata files as a directory
  const metaDirectoryCid = await pinDirectory(metadataFiles)

  // Preheat and upload files
  for (const [index, token] of tokensToMint.entries()) {
    const imageHash = imageHashes[index]
    await preheatAndUploadFiles(token, imageHash)
  }

  return metadataFiles.map((_, index) =>
    unSanitizeIpfsUrl(`ipfs://${metaDirectoryCid}/${index}.json`),
  )
}
