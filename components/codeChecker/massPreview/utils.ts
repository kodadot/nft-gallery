import type { AssetType } from '../types'

export type AssetElement = { src: string, tag: string }

export const AssetElementMap: Record<AssetType, AssetElement> = {
  style: { src: 'href', tag: 'link' },
  script: { src: 'src', tag: 'script' },
}

export const AssetReplaceElement: Record<
  AssetType,
  (params: { content: string, doc: Document, element: Element }) => void
> = {
  style: ({ doc, content, element }) => {
    const head = doc.querySelector('head')
    const style = document.createElement('style')
    style.innerHTML = content
    head?.appendChild(style)
    element.remove()
  },
  script: ({ content, element }) => {
    element.removeAttribute(AssetElementMap.script.src)
    element.innerHTML = content
  },
}
