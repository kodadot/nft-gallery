import { createOpenSeaMetadata as createMetadata, protocolize } from '@kodadot1/hyperdata'
import type { TokenToMint } from '../types'
import { pinDirectory } from '@/services/nftStorage'

export const constructDirectoryMeta = async (
  tokensToMint: TokenToMint[],
  options?: {
    enableCarbonOffset?: boolean
  },
): Promise<string[]> => {
  if (tokensToMint.map(({ file }) => file).some(file => !file)) {
    throw new ReferenceError('No file found for token')
  }
  const tokens = tokensToMint.filter(token => Boolean(token.file))
  const tokensMedia = tokens.map(token => token.file) as File[]
  const { enableCarbonOffset = false } = options ?? {}

  return await uploadMediaAndMetadataDirectories(tokensMedia, imageHashes =>
    tokens.map((token, index) =>
      createTokenMetadata(token, imageHashes[index], enableCarbonOffset, index),
    ),
  )
}

export const uploadMediaAndMetadataDirectories = async (
  mediaFiles: File[],
  metadataFactory: (imageHashes: string[]) => File[],
) => {
  const imageHashes = await uploadMediaFiles(mediaFiles)

  // Create metadata files
  const metadataFiles = metadataFactory(imageHashes)

  // Upload all metadata files as a directory
  const metaDirectoryCid = await pinDirectory(metadataFiles)

  // Preheat and upload files
  mediaFiles.map((_, index) =>
    preheatFileFromIPFS(extractCid(imageHashes[index])),
  )

  return metadataFiles.map((_, index) =>
    protocolize(`ipfs://${metaDirectoryCid}/${index}.json`),
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
    }
    else {
      currentBatch.push(file)
      currentBatchSize += file.size
    }
  }

  if (currentBatch.length > 0) {
    batches.push(currentBatch)
  }

  return batches
}

export const uploadMediaFiles = async (files: File[]): Promise<string[]> => {
  const MAX_BATCH_SIZE = 50 * 1024 * 1024 // 50 MB in bytes
  const serialFiles = mapToSerial(files)
  const fileBatches = batchFiles(serialFiles, MAX_BATCH_SIZE)

  const directoryCIDs: string[] = []
  for (const batch of fileBatches) {
    const directoryCid = await pinDirectory(batch)
    directoryCIDs.push(directoryCid)
  }

  return directoryCIDs.flatMap((directoryCid, batchIndex) =>
    fileBatches[batchIndex].map(
      file =>
        `ipfs://${directoryCid}/${file.name}`,
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

  return makeJsonFile(meta, String(index))
}

export const makeJsonFile = (data: unknown, name: string) =>
  new File([JSON.stringify(data, null, 2)], `${name}.json`, {
    type: 'application/json',
  })
