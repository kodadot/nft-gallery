import { validFormats } from '@/components/massmint/uploadCompressedMedia/useZipValidator'

export type Entry = {
  file: string
  name?: string
  description?: string
  price?: number
  valid: boolean
  currency?: string
}

export const validFileExtension = (stringWithFileName: string): boolean => {
  const extensionRegex = new RegExp(`\\.(${validFormats.join('|')})$`, 'i')
  return extensionRegex.test(stringWithFileName)
}

export const isValidEntry = (entry: Partial<Entry>): boolean => {
  if (!entry.file || !validFileExtension(entry.file)) {
    return false
  }

  if (!entry.name && !entry.description && entry.price === undefined) {
    return false
  }

  return true
}

export const removeQuotes = (str: string) => {
  return str.replace(/^['"](.*)['"]$/g, '$1')
}
