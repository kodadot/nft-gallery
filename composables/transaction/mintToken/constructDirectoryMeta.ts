import { createMetadata, unSanitizeIpfsUrl } from '@kodadot1/minimark/utils'
import { TokenToMint } from '../types'
import { pinDirectory } from '@/services/nftStorage'

export const constructDirectoryMeta = async (
  tokensToMint: TokenToMint[],
  options?: {
    enableCarbonOffset?: boolean
  },
): Promise<string[]> => {
  if (tokensToMint.map(({ file }) => file).some((file) => !file)) {
    throw new ReferenceError('No file found for token')
  }
  const tokens = tokensToMint.filter((token) => Boolean(token.file))
  const tokensMedia = tokens.map((token) => token.file) as File[]
  const { enableCarbonOffset = false } = options ?? {}
  const imageHashes = await uploadMediaFiles(tokensMedia)

  // Create metadata files
  const metadataFiles = tokens.map((token, index) =>
    createTokenMetadata(token, imageHashes[index], enableCarbonOffset, index),
  )

  // Upload all metadata files as a directory
  const metaDirectoryCid = await pinDirectory(metadataFiles)

  // Preheat and upload files
  await Promise.all(
    tokensMedia.map((media, index) =>
      preheatAndDirectUpload(media, imageHashes[index]),
    ),
  )

  return metadataFiles.map((_, index) =>
    unSanitizeIpfsUrl(`ipfs://${metaDirectoryCid}/${index}.json`),
  )
}

const getFileSuffix = (filename: string) => filename.split('.').pop() as string

const mapToSerial = (files: File[]): File[] =>
  files.map((file, index) => {
    const suffix = getFileSuffix(file.name)
    return new File([file], `${index}.${suffix}`)
  })

const batchFiles = (files: File[], maxBatchSize: number): File[][] => {
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

const uploadMediaFiles = async (files: File[]): Promise<string[]> => {
  const MAX_BATCH_SIZE = 100 * 1024 * 1024 // 100 MB in bytes
  const serialFiles = mapToSerial(files)
  const fileBatches = batchFiles(serialFiles, MAX_BATCH_SIZE)

  const directoryCIDs = await Promise.all(fileBatches.map(pinDirectory))

  return directoryCIDs.flatMap((directoryCid, batchIndex) =>
    fileBatches[batchIndex].map(
      (file, fileIndex) =>
        `ipfs://${directoryCid}/${fileIndex}.${getFileSuffix(file.name)}`,
    ),
  )
}

const createTokenMetadata = (
  token: TokenToMint,
  primaryHash: string,
  enableCarbonOffset: boolean,
  index: number,
): File => {
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

const preheatAndDirectUpload = async (
  media: File,
  primaryHash: string,
): Promise<void> => {
  const { $consola } = useNuxtApp()
  preheatFileFromIPFS(primaryHash)
  const filePair: [File, File | null] = [media, null]
  const hashPair: [string, string | undefined] = [primaryHash, undefined]
  await uploadDirectWhenMultiple(filePair, hashPair).catch($consola.warn)
}
