import { Entry } from './parsers/common'
import { parseCsv } from './parsers/parseCsv'
import { parseJson } from './parsers/parseJson'
import { parseTxt } from './parsers/parseTxt'

const readTextFile = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Unable to read file'))
      }
    }
    reader.onerror = () => {
      reject(new Error('Unable to read file'))
    }
    reader.readAsText(file)
  })
}

const readFileAndExtractEntries = async (
  file: File
): Promise<{ [key: string]: Entry } | undefined> => {
  const { $consola } = useNuxtApp()

  const extension = file.name.split('.').pop()?.toLowerCase()
  if (!extension) {
    $consola.warn(`Skipping file ${file.name}: Invalid extension`)
    return undefined
  }
  const fileContents = await readTextFile(file)

  let entries: Record<string, Entry> | undefined
  switch (extension) {
    case 'txt':
      entries = parseTxt(fileContents)
      break
    case 'csv':
      entries = parseCsv(fileContents)
      break
    case 'json':
      entries = parseJson(fileContents)
      break
    default:
      $consola.warn(`Skipping file ${file.name}: Invalid extension`)
      return undefined
  }

  return entries
}

export const useParseDescriptionFile = (file: File) => {
  const entries = ref<{ [key: string]: Entry } | undefined>(undefined)
  const loading = ref<boolean>(false)
  const error = ref<Error | undefined>(undefined)

  const parseDescriptionFile = async (file: File) => {
    loading.value = true
    try {
      entries.value = await readFileAndExtractEntries(file)
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  parseDescriptionFile(file)

  return {
    entries,
    loading,
    error,
  }
}
