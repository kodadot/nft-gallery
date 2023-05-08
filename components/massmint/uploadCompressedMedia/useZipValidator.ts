import { ref } from 'vue'
import { ZipEntry, unzip } from 'unzipit'
import { MAX_UPLOADED_FILE_SIZE } from '@/utils/constants'

export interface FileObject {
  imageUrl: string
  file: File
}

export interface WarningObject {
  name: string
  reason: string
}

export interface ValidityResult {
  validFiles: FileObject[]
  totalFiles: number
  warnings: WarningObject[]
}

export const validFormats = [
  'bmp',
  'gif',
  'jpg',
  'jpeg',
  'png',
  'svg',
  'tiff',
  'webp',
  'mp4',
  'ogv',
  'mov',
  'qt',
  'webm',
  'glb',
  'gltf',
  'flac',
  'mp3',
  'json',
]

const mimeTypes: { [key: string]: string } = {
  bmp: 'image/bmp',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  tiff: 'image/tiff',
  webp: 'image/webp',
  mp4: 'video/mp4',
  ogv: 'video/ogg',
  mov: 'video/quicktime',
  qt: 'video/quicktime',
  webm: 'video/webm',
  glb: 'model/gltf-binary',
  gltf: 'model/gltf+json',
  flac: 'audio/flac',
  mp3: 'audio/mpeg',
  json: 'application/json',
}

const toMegaBytes = (bytes: number) => bytes / Math.pow(1024, 2)

const isFileSizeTooLarge = (size: number): boolean =>
  toMegaBytes(size) > MAX_UPLOADED_FILE_SIZE

const getFileExtension = (name: string): string => {
  const lastDotIndex = name.lastIndexOf('.')
  return lastDotIndex !== -1
    ? name.substring(lastDotIndex + 1).toLowerCase()
    : ''
}

const isMacOsHiddenFile = (name: string): boolean => name.startsWith('__MACOSX')

const isValidFileExtension = (extension: string): boolean =>
  validFormats.includes(extension)

async function checkZipFileValidity(entries: {
  [key: string]: ZipEntry
}): Promise<ValidityResult> {
  const validFiles: FileObject[] = []
  const warnings: WarningObject[] = []

  for (const [name, entry] of Object.entries(entries)) {
    let isEntryValid = true
    if (isMacOsHiddenFile(name)) {
      isEntryValid = false
    }

    if (isEntryValid && (entry.isDirectory || name.includes('/'))) {
      warnings.push({
        name,
        reason: 'is a directory',
      })
      isEntryValid = false
    }

    if (isEntryValid && isFileSizeTooLarge(entry.size)) {
      warnings.push({
        name,
        reason: 'File size exceeds maximum limit',
      })
      isEntryValid = false
    }

    const fileExtension = getFileExtension(name)
    if (isEntryValid && !isValidFileExtension(fileExtension)) {
      warnings.push({
        name,
        reason: `Invalid file format (${fileExtension})`,
      })
      isEntryValid = false
    }

    if (isEntryValid) {
      const blob = await entry.blob(mimeTypes[fileExtension])
      const file: FileObject = {
        imageUrl: URL.createObjectURL(blob),
        file: new File([blob], name, { type: blob.type }),
      }
      validFiles.push(file)
    }
  }

  return {
    validFiles,
    totalFiles: Object.keys(entries).length,
    warnings,
  }
}

export function useZipFileValidator(zipFilePath: string) {
  const validFiles = ref<FileObject[]>([])
  const warnings = ref<WarningObject[]>([])
  const loading = ref<boolean>(true)
  const totalFiles = ref<number>(0)
  const allValid = ref<boolean>(false)

  const processZipFile = async () => {
    const { entries } = await unzip(zipFilePath)
    const {
      validFiles: validFilesValue,
      warnings: warningsValue,
      totalFiles: totalFilesValue,
    } = await checkZipFileValidity(entries)
    validFiles.value = validFilesValue
    warnings.value = warningsValue
    totalFiles.value = totalFilesValue
    loading.value = false
    allValid.value = validFilesValue.length === totalFilesValue
  }

  processZipFile()

  return { validFiles, warnings, loading, totalFiles, allValid }
}
