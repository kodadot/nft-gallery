import { ref } from 'vue'
import { ZipEntry, unzip } from 'unzipit'
import { MAX_UPLOADED_FILE_SIZE } from '@/utils/constants'

export interface FileObject {
  name: string
  url: string
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

const toMegaBytes = (bytes: number) => bytes / Math.pow(1024, 2)

const isFileSizeTooLarge = (size: number): boolean =>
  toMegaBytes(size) > MAX_UPLOADED_FILE_SIZE

const getFileExtension = (name: string): string => {
  const lastDotIndex = name.lastIndexOf('.')
  return lastDotIndex !== -1
    ? name.substring(lastDotIndex + 1).toLowerCase()
    : ''
}

const isValidFileExtension = (extension: string): boolean =>
  validFormats.includes(extension)

async function checkZipFileValidity(entries: {
  [key: string]: ZipEntry
}): Promise<ValidityResult> {
  const validFiles: FileObject[] = []
  const warnings: WarningObject[] = []

  for (const [name, entry] of Object.entries(entries)) {
    let isEntryValid = true

    if (entry.isDirectory || name.includes('/')) {
      warnings.push({
        name,
        reason: 'is a directory',
      })
      isEntryValid = false
    }

    if (isFileSizeTooLarge(entry.size)) {
      warnings.push({
        name,
        reason: 'File size exceeds maximum limit',
      })
      isEntryValid = false
    }

    const fileExtension = getFileExtension(name)
    if (!isValidFileExtension(fileExtension)) {
      warnings.push({
        name,
        reason: `Invalid file format (${fileExtension})`,
      })
      isEntryValid = false
    }

    if (isEntryValid) {
      const file: FileObject = {
        name,
        url: URL.createObjectURL(await entry.blob()),
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
