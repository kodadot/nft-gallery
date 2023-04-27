import { validFormats } from '../uploadCompressedMedia/useZipValidator'

export type Entry = {
  fileName: string
  title: string
  description: string
  price: number
  valid: boolean
  currency?: string
}

const isTxtFileValid = (fileData: string): boolean => {
  const invalidFileNameRegex = /file\s*:\s*[:\n]/gi
  const invalidNameRegex = /(?:\r?\n\s*)name\s*:\s*[\r\n]/gi
  const invalidDescriptionRegex = /(?:\r?\n\s*)description\s*:\s*[\r\n]/gi
  const invalidPriceRegex = /(?:\r?\n\s*)price\s*:\s*[^\d.,\s]/gi

  const invalidFileName = invalidFileNameRegex.test(fileData)
  const invalidName = invalidNameRegex.test(fileData)
  const invalidDescription = invalidDescriptionRegex.test(fileData)
  const invalidPrice = invalidPriceRegex.test(fileData)

  return !(invalidFileName || invalidName || invalidDescription || invalidPrice)
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

export function parseTxt(
  fileContent: string
): Record<string, Entry> | undefined {
  const fileData = fileContent.trim()
  if (!isTxtFileValid(fileData)) {
    console.error('Invalid TXT file structure')
    return undefined
  }

  // matches colon with optional whitespace before/after
  const colon = '\\s*:\\s*'
  // matches optional whitespace + new line both \n and \r\n
  const spacesAndNewlines = '\\s*\\r?\\n'

  /**
   * Matches nft description entries in the following format:
   * file: <file name>
   * name: <nft name>
   * description: <nft description>
   * price: <nft price> <currency>
   *
   * Regular expression breakdown:
   *  - (?<fileName>[^:\n]+) matches one or more non-colon and non-newline characters (file name) and names the group "fileName"
   *  - (?<name>.+?) matches one or more of any character (nft name) and names the group "name"
   *  - (?<price>\d{1,3}(?:[.,]\d{3})*(?:\.\d+)?) matches a number with optional thousands separators (comma or period) and optional decimal point (product price) and names the group "price"
   *  - (?:\s*(?<currency>.+))? matches optional whitespace + one or more of any character (product currency) and names the group "currency"
   *
   * Flags:
   *  - gi: case-insensitive matching for all occurrences
   */
  const entryRegex = new RegExp(
    String.raw`(?:file${colon})(?<fileName>[^:\n]+)` +
      String.raw`(?:${spacesAndNewlines}name${colon})(?<name>.+?)` +
      String.raw`(?:${spacesAndNewlines}description${colon})(?<description>.+?)` +
      String.raw`(?:${spacesAndNewlines}price${colon})(?<price>\d{1,3}(?:[.,]\d{3})*(?:\.\d+)?)(?:\s*(?<currency>.+))?`,
    'gi'
  )
  const entries: Record<string, Entry> = {}

  let matches
  while ((matches = entryRegex.exec(fileData))) {
    const [, fileName, title, description, price, currency] = matches
    const normalizedPrice = parseFloat(price.replace(',', '')) // Remove thousands separators (comma) and convert to a number
    entries[fileName.trim()] = {
      fileName: fileName.trim(),
      title: title.trim(),
      description: description.trim(),
      price: normalizedPrice,
      currency: currency ? currency.trim() : undefined,
      valid: true,
    }
  }

  if (Object.keys(entries).length === 0) {
    console.error('Invalid TXT file structure')
    return undefined
  }

  return entries
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

    //Check that header contains expected fields
    if (!csvHeaders.every((header) => expectedHeaders.includes(header))) {
      console.error('CSV file has incorrect header fields.', csvHeaders)
    }
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim()

      const values = line.split(',').map((value) => removeQuotes(value.trim()))
      const valid = isValidLine(line)

      const entry: Entry = {
        fileName: '',
        title: '',
        description: '',
        price: NaN,
        valid,
      }

      for (const [j, header] of csvHeaders.entries()) {
        try {
          const value = values[j]?.trim()
          console.log('value', value)
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
              entry.price = parseFloat(value)
              break
          }
        } catch (e) {
          console.error(e)
        }
      }

      entries[entry.fileName] = entry
    }
    return entries
  }

  // no header
  // assuming the following order: file, name, description, price

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim()
    console.log('line', line)
    const valid = isValidLine(line)

    const values = line.split(',').map((value) => removeQuotes(value.trim()))
    const [fileName, title, description, price] = values.map((v) => v.trim())

    entries[fileName || ''] = {
      fileName,
      title,
      description,
      price: parseFloat(price),
      valid,
    }
  }

  return entries
}

export function parseJson(jsonData: string): Record<string, Entry> {
  try {
    const data = JSON.parse(jsonData)

    if (!Array.isArray(data)) {
      throw new Error('Invalid JSON file structure. Data should be an array.')
    }

    const entries: Record<string, Entry> = {}

    data.forEach((item) => {
      const { file, name, description, price } = item
      const entry: Entry = {
        fileName: '',
        title: '',
        description: '',
        price: NaN,
        valid: false,
      }

      if (!file) {
        console.error(`Invalid item in JSON file: ${JSON.stringify(item)}`)
        entries[file] = {
          ...entry,
          fileName: '',
          valid: false,
        }
        return
      }
      if (!name || !description || !price) {
        console.error(
          `Missing required fields in JSON file: ${JSON.stringify(item)}`
        )
        entries[file] = {
          ...entry,
          fileName: file,
          valid: false,
        }
        return
      }

      const parsedPrice = parseFloat(price)

      if (Number.isNaN(parsedPrice)) {
        console.error(
          `Invalid price value in JSON file: ${JSON.stringify(item)}`
        )
        entries[file] = {
          ...entry,
          fileName: file,
          title: name,
          description,
          valid: false,
        }
        return
      }

      entries[file] = {
        fileName: file,
        title: name,
        description,
        price: parsedPrice,
        valid: true,
      }
    })

    return entries
  } catch (error) {
    console.error(`Error parsing JSON file: ${error}`)
    return {}
  }
}
