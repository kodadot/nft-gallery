import { ZipEntry, unzip } from 'unzipit'
import config from './codechecker.config'

export const postAssetsToSandbox = (message: Array<AssetMessage>) => {
  const iframe = document.getElementById(config.iframeId) as HTMLIFrameElement
  if (iframe?.contentWindow) {
    iframe.contentWindow.postMessage(
      { type: 'assets', assets: JSON.parse(JSON.stringify(message)) },
      window.location.origin,
    )
  }
}

export type AssetMessage = {
  type: 'script' | 'style'
  location: 'head' | 'body'
  src: string
  originalSrc: string
}

type FileEntry = { path: string; content: string }
export const generateRandomHash = async (
  algorithm: AlgorithmIdentifier = 'SHA-1',
) => {
  const randomValue = window.crypto
    .getRandomValues(new Uint8Array(20))
    .toString()

  const encoder = new TextEncoder()
  const data = encoder.encode(randomValue)

  const hashBuffer = await window.crypto.subtle.digest(algorithm, data)

  // Convert the buffer to a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

  return hashHex
}

export const extractAssetsFromZip = async (
  zip: File,
): Promise<{
  indexFile: FileEntry
  sketchFile: FileEntry
  entries: { [key: string]: ZipEntry }
}> => {
  const { entries } = await unzip(zip)
  const filePaths = Object.keys(entries)
  const htmlFiles: Array<FileEntry> = [],
    jsFiles: Array<FileEntry> = []

  let commonPrefix = ''

  // Find the path for index.html to determine the nesting level
  const indexPath = filePaths[0]
  if (indexPath) {
    const lastSlashIndex = indexPath.lastIndexOf('/')
    if (lastSlashIndex !== -1) {
      // Extract everything before the last slash to get the directory
      commonPrefix = indexPath.substring(0, lastSlashIndex + 1)
    }
  }

  // Process each file in the ZIP
  for (const [path, file] of Object.entries(entries)) {
    const adjustedPath = path.replace(commonPrefix, '')
    const content = await file.text()

    // Categorize files based on extension
    if (path.endsWith('index.html')) {
      htmlFiles.push({ path: adjustedPath, content })
    } else if (path.endsWith(config.sketchFile)) {
      jsFiles.push({ path: adjustedPath, content })
    }
  }

  return {
    indexFile: htmlFiles[0],
    sketchFile: jsFiles[0],
    entries,
  }
}

const cleanFileName = (path) => {
  const parts = path.split('/')
  return parts[parts.length - 1] // Returns only the file name
}

const createBlobUrlForEntry = async (entry, mimeType) => {
  const blob = await entry.blob()
  const typedBlob = new Blob([blob], { type: mimeType })
  return URL.createObjectURL(typedBlob)
}

// process and add a single asset to the assets array
const processAsset = async (element, entries, assets) => {
  const srcOrHref = element.getAttribute('src') ?? element.getAttribute('href')
  const isExternal = srcOrHref.startsWith('http')
  const mimeType =
    element.tagName.toLowerCase() === 'script' ? 'text/javascript' : 'text/css'
  const location =
    element.parentNode.tagName.toLowerCase() === 'head' ? 'head' : 'body'

  const asset: AssetMessage = {
    type: element.tagName.toLowerCase() === 'script' ? 'script' : 'style',
    location: location,
    src: srcOrHref,
    originalSrc: srcOrHref,
  }

  if (isExternal) {
    assets.push(asset)

    return
  }

  const cleanName = cleanFileName(srcOrHref)
  const matchingEntryKey = Object.keys(entries).find((key) =>
    key.endsWith(cleanName),
  )
  if (matchingEntryKey) {
    const blobUrl = await createBlobUrlForEntry(
      entries[matchingEntryKey],
      mimeType,
    )
    asset.src = blobUrl

    assets.push(asset)
  }
}

export const createSandboxAssets = async (
  indexFile: FileEntry,
  entries: { [key: string]: ZipEntry },
) => {
  const assets: Array<AssetMessage> = []
  const htmlContent = indexFile.content
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, 'text/html')

  const assetElements = Array.from(
    doc.querySelectorAll('script[src], link[rel="stylesheet"][href]'),
  )

  for (const element of assetElements) {
    await processAsset(element, entries, assets)
  }
  return assets
}
