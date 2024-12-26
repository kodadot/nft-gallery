import type { OpenSeaAttribute } from '@kodadot1/hyperdata'
import type { Entry } from './common'
import { isValidEntry, removeQuotes, validFileExtension } from './common'

const DEFAULT_CSV_HEADERS = ['file', 'name', 'description', 'attributes', 'price']

const ATTRIBUTE_SEPARATOR = ';'
const ATTRIBUTE_KEY_VALUE_SEPARATOR = ':'

function processCsvLines(lines: string[], csvHeaders: string[]): Record<string, Entry> {
  const entries: Record<string, Entry> = {}

  for (const line of lines) {
    const values = line.split(',').map(value => removeQuotes(value.trim()))
    const entry: Partial<Entry> = {
      file: undefined,
      name: undefined,
      description: undefined,
      attributes: undefined,
      price: undefined,
    }

    for (const [j, header] of csvHeaders.entries()) {
      const value = values[j]?.trim()
      if (header === 'price') {
        entry.price = parseFloat(value) || undefined
      }
      else if (header === 'attributes') {
        if (value) {
          const attributes: OpenSeaAttribute[] = []
          const attrs: Record<string, string> = {}
          value.split(ATTRIBUTE_SEPARATOR).forEach((attr) => {
            const [key, val] = attr.split(ATTRIBUTE_KEY_VALUE_SEPARATOR)
            if (key && val)
              attrs[key.trim()] = val.trim()
            attributes.push({
              trait_type: key,
              value: val,
            })
          })
          entry.attributes = attributes
        }
      }
      else {
        entry[header] = value || undefined
      }
    }

    entry.valid = isValidEntry(entry)

    entries[entry.file as string] = entry as Entry
  }

  return entries
}

function parseCsvWithHeaders(lines, csvHeaders): Record<string, Entry> {
  return processCsvLines(lines, csvHeaders)
}

function parseCsvWithoutHeaders(lines): Record<string, Entry> {
  return processCsvLines(lines, DEFAULT_CSV_HEADERS)
}

export function parseCsv(csvData: string): Record<string, Entry> {
  const { $consola } = useNuxtApp()

  const lines = csvData.trim().split('\n')
  const firstLine = lines[0]

  const hasHeader = validFileExtension(firstLine)

  if (hasHeader) {
    const csvHeaders = lines[0]
      .split(',')
      .map(header => header.trim().toLowerCase())

    // Check that header contains expected fields
    if (!csvHeaders.every(header => DEFAULT_CSV_HEADERS.includes(header))) {
      $consola.error('CSV file has incorrect header fields.', csvHeaders)
    }

    return parseCsvWithHeaders(lines, csvHeaders)
  }
  return parseCsvWithoutHeaders(lines)
}
