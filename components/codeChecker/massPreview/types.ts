type PreviewItem = {
  hash: string
  loading: boolean
}

export type CapturePreviewItem = {
  image?: string
  startedAt?: number
  renderedAt?: number
} & PreviewItem

export type CanvasPreviewItem = {
  startedAt: number
  renderedAt?: number
} & PreviewItem
