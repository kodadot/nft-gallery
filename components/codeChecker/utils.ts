import { unzip } from 'unzipit'
import config from './codechecker.config'

export const postAssetsToSandbox = (message: Array<AssetMessage>) => {
  const iframe = document.getElementById(config.iframeId) as HTMLIFrameElement
  if (iframe?.contentWindow) {
    iframe.contentWindow.postMessage(
      JSON.stringify(message),
      window.location.origin,
    )
  }
}

export type AssetMessage = {
  type: 'script' | 'style'
  location: 'head' | 'body'
  src: string
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
  jsFiles: FileEntry[]
  cssFiles: FileEntry[]
}> => {
  const { entries } = await unzip(zip)
  const filePaths = Object.keys(entries)
  const htmlFiles: Array<FileEntry> = [],
    jsFiles: Array<FileEntry> = [],
    cssFiles: Array<FileEntry> = []

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
    } else if (path.endsWith('.js')) {
      jsFiles.push({ path: adjustedPath, content })
    } else if (path.endsWith('.css')) {
      cssFiles.push({ path: adjustedPath, content })
    }
  }

  return {
    indexFile: htmlFiles[0],
    jsFiles,
    cssFiles,
  }
}

export const createSandboxAssets = (
  indexFile: FileEntry,
  jsFiles: FileEntry[],
  cssFiles: FileEntry[],
) => {
  const assets: Array<AssetMessage> = []
  const htmlContent = indexFile.content
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, 'text/html')

  // External JS and CSS already in HTML
  doc
    .querySelectorAll(
      'script[src^="http"], link[rel="stylesheet"][href^="http"]',
    )
    .forEach((element) => {
      if (element.tagName.toLowerCase() === 'script') {
        const scriptElement = element as HTMLScriptElement
        assets.push({
          type: 'script',
          location: 'head',
          src: scriptElement.src,
        })
      } else if (element.tagName.toLowerCase() === 'link') {
        const linkElement = element as HTMLLinkElement
        assets.push({ type: 'style', location: 'head', src: linkElement.href })
      }
    })

  // Local JS files
  jsFiles.forEach(({ content }) => {
    const blob = new Blob([content], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    assets.push({ type: 'script', location: 'body', src: url })
  })

  // Local CSS files
  cssFiles.forEach(({ content }) => {
    const blob = new Blob([content], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    assets.push({ type: 'style', location: 'head', src: url })
  })

  return assets
}
