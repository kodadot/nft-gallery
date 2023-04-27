import { Entry, parseCsv, parseJson, parseTxt } from './parsers'
import { readTextFile } from './readTextFile'

async function readFileAndExtractEntries(
  file: File
): Promise<{ [key: string]: Entry } | undefined> {
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (!extension) {
    console.warn(`Skipping file ${file.name}: Invalid extension`)
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
      console.warn(`Skipping file ${file.name}: Invalid extension`)
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
      console.log('entries', entries.value)
    } catch (e: any) {
      error.value = e
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
