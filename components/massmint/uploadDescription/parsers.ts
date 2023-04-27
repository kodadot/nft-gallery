import { validFormats } from '../uploadCompressedMedia/useZipValidator'

export type Entry = {
  fileName: string
  title: string
  description: string
  price: string
}
export function parseTxt(
  fileContent: string
): Record<string, Entry> | undefined {
  const fileData = fileContent.trim()

  /**
   * Matches nft description entries in the following format:
   * file: <file name>
   * name: <nft name>
   * description: <nft description>
   * price: <nft price> <currency>
   *
   * Regular expression breakdown:
   *  - file\s*:\s* matches "file:" with optional whitespace before/after colon
   *  - (\S+) matches one or more non-whitespace characters (file name)
   *  - \n\s*name\s*:\s* matches new line + "name:" with optional whitespace
   *  - (.+) matches one or more of any character (product name)
   *  - \n\s*description\s*:\s* matches new line + "description:" with optional whitespace
   *  - (.+) matches one or more of any character (product description)
   *  - \n\s*price\s*:\s* matches new line + "price:" with optional whitespace
   *  - (\d+(\.\d+)?) matches one or more digits with optional decimal point (product price)
   *  - \s*(.+) matches optional whitespace + one or more of any character (product currency)
   *
   * Flags:
   *  - /gi: case-insensitive matching for all occurrences
   */

  const entryRegex =
    /file\s*:\s*(\S+)\s*\n\s*name\s*:\s*(.+)\s*\n\s*description\s*:\s*(.+)\s*\n\s*price\s*:\s*(\d+(\.\d+)?)\s*(.+)/gi
  const entries: Record<string, Entry> = {}

  let matches
  while ((matches = entryRegex.exec(fileData))) {
    const [, fileName, title, description, price] = matches
    entries[fileName] = {
      fileName: fileName.trim(),
      title: title.trim(),
      description: description.trim(),
      price: price.trim(),
    }
  }

  if (Object.keys(entries).length === 0) {
    console.error('Invalid TXT file structure')
    return undefined
  }

  return entries
}

const isValidLine = (line: string, numOfValues = 4) => {
  const values = line.split(',')
  if (values.length !== numOfValues) {
    // Invalid line
    return false
  }
  if (!values[0].match(new RegExp(`\\.(${validFormats.join('|')})$`, 'i'))) {
    // Invalid file extension
    return false
  }
  if (typeof values[1] !== 'string' || typeof values[2] !== 'string') {
    // Invalid title or description
    return false
  }
  const parsedPrice = parseFloat(values[3])
  if (isNaN(parsedPrice)) {
    // Invalid price
    return false
  }

  return true
}

const removeQuotes = (str: string) => {
  return str.replace(/^['"](.*)['"]$/g, '$1')
}

export function parseCsv(csvData: string): Record<string, Entry> {
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

    // Check that header contains expected fields
    if (!csvHeaders.every((header) => expectedHeaders.includes(header))) {
      throw new Error('CSV file has incorrect header fields.')
    }
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim()
      const values = line.split(',').map((value) => removeQuotes(value.trim()))
      if (isValidLine(line)) {
        const entry: Entry = {
          fileName: '',
          title: '',
          description: '',
          price: '',
        }
        for (const [j, header] of csvHeaders.entries()) {
          const value = values[j].trim()
          switch (header) {
            case 'file':
              entry.fileName = value
              break
            case 'name':
              entry.title = value
              break
            case 'description':
              entry.description = value
              break
            case 'price':
              entry.price = value
              break
          }
        }
        entries[entry.fileName] = entry
      }
    }
    return entries
  }

  // no header
  // assuming the following order: file, name, description, price

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim()
    if (isValidLine(line)) {
      const values = line.split(',').map((value) => removeQuotes(value.trim()))
      const [fileName, title, description, price] = values.map((v) => v.trim())
      entries[fileName] = {
        fileName,
        title,
        description,
        price,
      }
    }
  }

  return entries
}
