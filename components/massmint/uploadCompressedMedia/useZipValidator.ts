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

const validFormats = ['png']

const toMegaBytes = (bytes: number) => bytes / Math.pow(1024, 2)

async function checkZipFileValidity(entries: {
  [key: string]: ZipEntry
}): Promise<ValidityResult> {
  const validFiles: FileObject[] = []
  const warnings: WarningObject[] = []

  for (const [name, entry] of Object.entries(entries)) {
    if (entry.isDirectory) {
      warnings.push({
        name,
        reason: 'is a directory',
      })
      continue
    }

    if (toMegaBytes(entry.size) > MAX_UPLOADED_FILE_SIZE) {
      warnings.push({
        name,
        reason: 'File size exceeds maximum limit',
      })
      continue
    }

    const lastDotIndex = name.lastIndexOf('.')
    if (lastDotIndex === -1) {
      warnings.push({
        name,
        reason: 'File does not have an extension',
      })
      continue
    }

    const fileExtension = name
      .substring(name.lastIndexOf('.') + 1)
      .toLowerCase()
    const isValidExtension = validFormats.includes(fileExtension)

    if (!isValidExtension) {
      warnings.push({
        name,
        reason: `Invalid file format (${fileExtension})`,
      })
      continue
    }

    validFiles.push({
      name,
      url: URL.createObjectURL(await entry.blob()),
    })
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

  watch(loading, (loadingValue) => {
    console.log('loading', loadingValue)
    if (!loadingValue) {
      console.log('validFiles', validFiles.value)
      console.log('warnings', warnings.value)
      console.log('totalFiles', totalFiles.value)
      console.log('allValid', allValid.value)
    }
  })

  return { validFiles, warnings, loading, totalFiles, allValid }
}
