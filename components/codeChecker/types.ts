type Success<T> = {
  isSuccess: true
  value: T
}

type Failure = {
  isSuccess: false
  error: string
}

export type Passed = boolean | 'loading' | 'unknown'

export type Result<T> = Success<T> | Failure

export type Validity = {
  canvasSize: string
  title: string
  webGLSupported: boolean
  localP5jsUsed: boolean
  kodaRendererUsed: Passed
  resizerUsed: boolean
  usesHashParam: boolean
  validTitle: boolean
  renderDurationValid: Passed
}

export type AssetMessage = {
  type: 'script' | 'style'
  parent: 'head' | 'body'
  src: string
  originalSrc: string
}
