import { Entry, isValidEntry, removeQuotes, validFileExtension } from './common'

function processCsvLine(line: string, csvHeaders: string[]): Partial<Entry> {
  const values = line.split(',').map((value) => removeQuotes(value.trim()))
  const entry: Partial<Entry> = {
    file: undefined,
    name: undefined,
    description: undefined,
    price: undefined,
  }

  for (const [j, header] of csvHeaders.entries()) {
    const value = values[j]?.trim()
    if (header === 'price') {
      entry.price = parseFloat(value) || undefined
    } else {
      entry[header] = value || undefined
    }
  }

  return entry
}

function parseCsvWithHeaders(lines, csvHeaders): Record<string, Entry> {
  const entries: Record<string, Entry> = {}

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    const entry = processCsvLine(line, csvHeaders)

    entry.valid = isValidEntry(entry)
    entries[entry.file as string] = entry as Entry
  }

  return entries
}

function parseCsvWithoutHeaders(lines): Record<string, Entry> {
  const entries: Record<string, Entry> = {}

  for (const line_ of lines) {
    const line = line_.trim()
    const values = line.split(',').map((value) => removeQuotes(value.trim()))
    const [file, name, description, price] = values.map((v) => v.trim())

    const entry = {
      file,
      name: name === '' ? undefined : name,
      description: description === '' ? undefined : description,
      price: parseFloat(price) || undefined,
    }
    entries[file] = {
      ...entry,
      valid: isValidEntry(entry),
    }
  }

  return entries
}

export function parseCsv(csvData: string): Record<string, Entry> {
  const { $consola } = useNuxtApp()

  const lines = csvData.trim().split('\n')
  const firstLine = lines[0]
  const expectedHeaders = ['file', 'name', 'description', 'price']

  const hasHeader = validFileExtension(firstLine)

  if (hasHeader) {
    const csvHeaders = lines[0]
      .split(',')
      .map((header) => header.trim().toLowerCase())

    // Check that header contains expected fields
    if (!csvHeaders.every((header) => expectedHeaders.includes(header))) {
      $consola.error('CSV file has incorrect header fields.', csvHeaders)
    }

    return parseCsvWithHeaders(lines, csvHeaders)
  }
  return parseCsvWithoutHeaders(lines)
}
