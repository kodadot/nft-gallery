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
  resizerUsed: Passed
  usesHashParam: Passed
  validTitle: Passed
  renderDurationValid: Passed
  validKodaRenderPayload: Passed
  // same hash should create same art, otherwise this will be false
  consistent: Passed
}

export type AssetMessage = {
  type: 'script' | 'style'
  parent: 'head' | 'body'
  src: string
  originalSrc: string
}
