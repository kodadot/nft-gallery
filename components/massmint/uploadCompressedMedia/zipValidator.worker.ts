declare function importScripts(...urls: string[]): void

interface Unzipit {
  (zipFile: string): Promise<{
    files: {
      path: string
      uncompressedSize: number
      blob: () => Promise<Blob>
    }[]
  }>
}

const unzipit: Unzipit = (self as any).unzipit

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

onmessage = async (event: MessageEvent<string>) => {
  importScripts('unzipit.js', 'path.js')
  const zipFilePath = event.data
  const zip = await unzipit(zipFilePath)
  console.log('zip', zip)
  const validFiles: FileObject[] = []
  const warnings: WarningObject[] = []
  for (const file of zip.files) {
    console.log('file', file)
    const extension = (self as any).path.extname(file.path)
    if (extension === '.png') {
      const size = file.uncompressedSize
      if (size > MAX_UPLOADED_FILE_SIZE) {
        warnings.push({
          name: file.path,
          reason: `File size exceeds the maximum limit of ${MAX_UPLOADED_FILE_SIZE} bytes.`,
        })
      } else {
        validFiles.push({
          name: file.path,
          url: URL.createObjectURL(await file.blob()),
        })
      }
    } else {
      warnings.push({
        name: file.path,
        reason: `File extension "${extension}" is not supported.`,
      })
    }
  }
  const result: ValidityResult = {
    validFiles,
    totalFiles: zip.files.length,
    warnings,
  }
  postMessage(result)
}

export {}
