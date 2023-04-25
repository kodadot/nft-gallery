export type Entry = {
  fileName: string
  title: string
  description: string
  price: string
}
export async function extractEntriesFromTxtFile(
  fileContent: string
): Promise<Record<string, Entry> | undefined> {
  const fileData = fileContent.trim()
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
