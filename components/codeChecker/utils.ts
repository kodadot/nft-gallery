import type { ZipEntry } from 'unzipit'
import { unzip } from 'unzipit'
import { blake2AsHex } from '@polkadot/util-crypto'
import config from './codechecker.config'
import type { AssetMessage } from './types'

type FileEntry = { path: string, content: string }

const cleanFileName = (path) => {
  const parts = path.split('/')
  return parts[parts.length - 1] // Returns only the file name
}

const createBlobUrlForEntry = async (entry, mimeType) => {
  const blob = await entry.blob()
  const typedBlob = new Blob([blob], { type: mimeType })
  return URL.createObjectURL(typedBlob)
}

const extractAssetAttributes = (
  element: HTMLScriptElement | HTMLLinkElement,
): {
  srcOrHref: string
  isExternal: boolean
  mimeType: string
  parent: 'head' | 'body'
} => {
  const srcOrHref = (element.getAttribute('src')
    ?? element.getAttribute('href')) as string
  const isExternal = srcOrHref.startsWith('http')
  const mimeType
    = element.tagName.toLowerCase() === 'script' ? 'text/javascript' : 'text/css'
  const parent
    = element.parentNode?.nodeName.toLowerCase() === 'head' ? 'head' : 'body'

  return { srcOrHref, isExternal, mimeType, parent: parent }
}

// process and add a single asset to the assets array
const processAsset = async (element, entries, assets) => {
  const attributes = extractAssetAttributes(element)
  const assetType
    = element.tagName.toLowerCase() === 'script' ? 'script' : 'style'

  const asset: AssetMessage = {
    type: assetType,
    parent: attributes.parent,
    src: attributes.srcOrHref,
    originalSrc: attributes.srcOrHref,
  }

  if (attributes.isExternal) {
    assets.push(asset)
    return
  }

  const cleanName = cleanFileName(attributes.srcOrHref)
  const matchingEntryKey = Object.keys(entries).find(key =>
    key.endsWith(cleanName),
  )

  if (matchingEntryKey) {
    const blobUrl = await createBlobUrlForEntry(
      entries[matchingEntryKey],
      attributes.mimeType,
    )
    asset.src = blobUrl
    assets.push(asset)
  }
}

const calculateCommonPrefix = (filePaths: string[]): string => {
  let commonPrefix = ''
  const indexPath = filePaths[0]
  if (indexPath) {
    const lastSlashIndex = indexPath.lastIndexOf('/')
    if (lastSlashIndex !== -1) {
      commonPrefix = indexPath.substring(0, lastSlashIndex + 1)
    }
  }
  return commonPrefix
}

const categorizeFiles = async (
  entries: { [key: string]: ZipEntry },
  commonPrefix: string,
): Promise<{ htmlFiles: FileEntry[], jsFiles: FileEntry[] }> => {
  const htmlFiles: FileEntry[] = []
  const jsFiles: FileEntry[] = []

  for (const [path, file] of Object.entries(entries)) {
    const adjustedPath = path.replace(commonPrefix, '')
    const content = await file.text()

    if (path.endsWith('index.html')) {
      htmlFiles.push({ path: adjustedPath, content })
    }
    else if (path.endsWith('.js') && !path.includes(config.p5)) {
      jsFiles.push({ path: adjustedPath, content })
    }
  }

  return { htmlFiles, jsFiles }
}

// exported functions

export const postAssetsToSandbox = (
  message: Array<AssetMessage>,
  iframeId: string,
) => {
  const iframe = document.getElementById(iframeId) as HTMLIFrameElement
  if (iframe?.contentWindow) {
    iframe.contentWindow.postMessage(
      { type: 'assets', assets: JSON.parse(JSON.stringify(message)) },
      window.location.origin,
    )
  }
}

export const generateRandomHash = () => {
  const randomValue = window.crypto
    .getRandomValues(new Uint8Array(20))
    .toString()
  return blake2AsHex(randomValue, 256, null, true)
}

export const extractAssetsFromZip = async (
  zip: File,
): Promise<{
  indexFile: FileEntry
  sketchFile: FileEntry
  entries: { [key: string]: ZipEntry }
  jsFiles: FileEntry[]
}> => {
  const { entries } = await unzip(zip)
  const filePaths = Object.keys(entries)

  const commonPrefix = calculateCommonPrefix(filePaths)

  const { htmlFiles, jsFiles } = await categorizeFiles(entries, commonPrefix)
  const sketchFile = jsFiles.find(file =>
    file.path.includes(config.sketchFile),
  ) as FileEntry

  return {
    indexFile: htmlFiles[0],
    sketchFile,
    entries,
    jsFiles,
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

export const getDocumentFromString = (html: string): Document => {
  const parser = new DOMParser()
  return parser.parseFromString(html, 'text/html')
}
