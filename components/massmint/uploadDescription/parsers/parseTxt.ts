import { Entry, isValidEntry } from './common'

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

function processBlock(block: string): Partial<Entry> {
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

  return entry
}

export function parseTxt(
  fileContent: string
): Record<string, Entry> | undefined {
  const { $consola } = useNuxtApp()
  const fileData = fileContent.trim()
  const blocks = fileData.split(/(?:\r?\n\s*){2,}/)

  const entries: Record<string, Entry> = {}

  for (const block of blocks) {
    const entry = processBlock(block)

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
