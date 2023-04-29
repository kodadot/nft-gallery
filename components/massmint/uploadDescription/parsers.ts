import { validFormats } from '../uploadCompressedMedia/useZipValidator'

export type Entry = {
  file: string
  name?: string
  description?: string
  price?: number
  valid: boolean
  currency?: string
}

const validFileExtension = (stringWithFileName: string): boolean => {
  const extensionRegex = new RegExp(`\\.(${validFormats.join('|')})$`, 'i')
  return extensionRegex.test(stringWithFileName)
}

const isValidEntry = (entry: Partial<Entry>): boolean => {
  if (!entry.file || !validFileExtension(entry.file)) {
    return false
  }

  if (!entry.name && !entry.description && entry.price === undefined) {
    return false
  }

  return true
}

const removeQuotes = (str: string) => {
  return str.replace(/^['"](.*)['"]$/g, '$1')
}

/**
 * Parses a single line of text and extracts the field name and its value.
 *
 * The function takes a line of text as input and matches it against a regular
 * expression to identify the field name (file, name, description, or price)
 * and the value associated with it.
 *
 * Example:
 *  Input: "name: Beautiful Landscape"
 *  Output: { fieldName: "name", fieldValue: "Beautiful Landscape" }
 *
 */
function parseField(
  line: string
): { fieldName: string; fieldValue: string } | null {
  const colon = '\\s*:\\s*'
  const fieldNameRegex = new RegExp(
    `^(?<fieldName>file|name|description|price)${colon}`,
    'i'
  )
  const fieldNameMatch = fieldNameRegex.exec(line)

  if (fieldNameMatch) {
    const fieldName = fieldNameMatch.groups?.fieldName.toLowerCase() as string
    const fieldValue = line.substring(fieldNameMatch[0].length).trim()
    return { fieldName, fieldValue }
  }

  return null
}

/**
 * Parses the price and currency from a string.
 *
 * The function takes a string as input and matches it against a regular
 * expression to extract the price and currency.
 */

function parsePriceAndCurrency(fieldValue: string): {
  price: number | undefined
  currency: string | undefined
} {
  const priceRegex =
    /^(?<price>\d{1,3}(?:[.,]\d{3})*(?:\.\d+)?)(?:\s*(?<currency>.+))?$/
  const priceMatch = priceRegex.exec(fieldValue)

  if (priceMatch) {
    const price = parseFloat(priceMatch.groups?.price.replace(',', '') || '')
    const currency = priceMatch.groups?.currency?.trim()

    return { price, currency }
  }

  return { price: undefined, currency: undefined }
}

export function parseTxt(
  fileContent: string
): Record<string, Entry> | undefined {
  const { $consola } = useNuxtApp()
  const fileData = fileContent.trim()
  const blocks = fileData.split(/(?:\r?\n\s*){2,}/)

  const entries: Record<string, Entry> = {}

  for (const block of blocks) {
    const lines = block.split(/\r?\n/)
    const entry: Partial<Entry> = {}

    for (const line of lines) {
      const parsedField = parseField(line)

      if (parsedField) {
        const { fieldName, fieldValue } = parsedField
        if (fieldName === 'price') {
          const { price, currency } = parsePriceAndCurrency(fieldValue)
          entry.price = price
          entry.currency = currency
        } else {
          entry[fieldName] = fieldValue
        }
      }
    }

    if (entry.file) {
      entries[entry.file] = {
        file: entry.file,
        name: entry.name || undefined,
        description: entry.description || undefined,
        price: entry.price || undefined,
        currency: entry.currency || undefined,
        valid: isValidEntry(entry),
      }
    } else {
      $consola.error('Unable to extract file name from invalid block')
    }
  }

  if (Object.keys(entries).length === 0) {
    $consola.error('Invalid TXT file structure')
    return undefined
  }

  return entries
}

export function parseCsv(csvData: string): Record<string, Entry> {
  const { $consola } = useNuxtApp()

  const entries: Record<string, Entry> = {}
  const lines = csvData.trim().split('\n')
  const firstLine = lines[0]
  const extensionRegex = new RegExp(`\\.${validFormats.join('|')}$`, 'i')
  const expectedHeaders = ['file', 'name', 'description', 'price']

  const hasHeader = firstLine.match(extensionRegex) === null
  const startIndex = hasHeader ? 1 : 0

  if (hasHeader) {
    const csvHeaders = lines[0]
      .split(',')
      .map((header) => header.trim().toLowerCase())

    //Check that header contains expected fields
    if (!csvHeaders.every((header) => expectedHeaders.includes(header))) {
      $consola.error('CSV file has incorrect header fields.', csvHeaders)
    }
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim()
      const values = line.split(',').map((value) => removeQuotes(value.trim()))

      const entry: Partial<Entry> = {
        file: undefined,
        name: undefined,
        description: undefined,
        price: undefined,
      }

      for (const [j, header] of csvHeaders.entries()) {
        try {
          const value = values[j]?.trim()
          if (header === 'price') {
            entry.price = parseFloat(value) || undefined
          } else {
            entry[header] = value === '' ? undefined : value
          }
        } catch (e) {
          $consola.error(e)
        }
      }
      entry.valid = isValidEntry(entry)
      entries[entry.file as string] = entry as Entry
    }
    return entries
  }

  // no header
  // assuming the following order: file, name, description, price

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim()

    const values = line.split(',').map((value) => removeQuotes(value.trim()))
    const [file, name, description, price] = values.map((v) => v.trim())

    const entry = {
      file,
      name: name === '' ? undefined : name,
      description: description === '' ? undefined : description,
      price: parseFloat(price) || undefined,
    }
    const valid = isValidEntry(entry)
    entries[file] = {
      ...entry,
      valid,
    }
  }

  return entries
}

export function parseJson(jsonData: string): Record<string, Entry> {
  const { $consola } = useNuxtApp()

  try {
    const data = JSON.parse(jsonData)

    if (!Array.isArray(data)) {
      throw new Error('Invalid JSON file structure. Data should be an array.')
    }

    const entries: Record<string, Entry> = {}

    data.forEach((item) => {
      const entry: Partial<Entry> = {
        file: item.file || undefined,
        name: item.name || undefined,
        description: item.description || undefined,
        price: item.price !== undefined ? parseFloat(item.price) : undefined,
      }

      if (!entry.file) {
        $consola.error(`Invalid item in JSON file: ${JSON.stringify(item)}`)
        entries[item.file] = {
          ...entry,
          file: '',
          valid: false,
        }
        return
      }
      const valid = isValidEntry(entry)
      entries[item.file] = {
        ...(entry as Entry),
        valid,
      }
    })

    return entries
  } catch (error) {
    $consola.error(`Error parsing JSON file: ${error}`)
    return {}
  }
}
