import { Entry, extractEntriesFromTxtFile } from './parseTxt'
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

  console.log('fileContents', fileContents)

  let entries: Record<string, Entry> | undefined
  switch (extension) {
    case 'txt':
      entries = await extractEntriesFromTxtFile(fileContents)
      break
    // case 'csv':
    //   entries = await readCsvFile(file)
    //   break
    // case 'json':
    //   entries = await readJsonFile(file)
    //   break
    default:
      console.warn(`Skipping file ${file.name}: Invalid extension`)
      return undefined
  }

  //   if (!entries || entries.length === 0) {
  //     console.warn(`Skipping file ${file.name}: No entries found`)
  //     return undefined
  //   }

  //   const validatedEntries: { [key: string]: Entry } = {}
  //   for (let i = 0; i < entries.length; i++) {
  //     const entry = entries[i]
  //     const validationErrors = validateEntry(entry)
  //     if (validationErrors.length === 0) {
  //       validatedEntries[entry.fileName] = entry
  //     } else {
  //       console.warn(
  //         `Skipping entry in file ${file.name}: ${validationErrors.join(', ')}`
  //       )
  //     }
  //   }

  //   if (Object.keys(validatedEntries).length === 0) {
  //     console.warn(`Skipping file ${file.name}: No valid entries found`)
  //     return undefined
  //   }

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
