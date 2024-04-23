import { Result, Validity } from './types'

type HtmlContentValidationResult = {
  localP5jsUsed: boolean
  titlePresent: boolean
  correctTitle: boolean
  title: string
}

type InnerValidity = Pick<
  Validity,
  | 'canvasSize'
  | 'webGLSupported'
  | 'localP5jsUsed'
  | 'validTitle'
  | 'kodaRendererUsed'
  | 'resizerUsed'
  | 'usesHashParam'
  | 'title'
>

const constants = {
  canvasRegex: /createCanvas\(([^,]+?),\s*([^\s,]+?)(,\s*WEBGL)?\)/,
  graphicsRegex: /createGraphics\(([^,]+?),\s*([^\s,]+?)(,\s*WEBGL)?\)/,
  getUrlParamsRegex: /\b(const|let|var)\s+(\w+)\s*=\s*getURLParams\(\)\s*/,
  urlSearchParamsRegex:
    /\b(const|let|var)\s+(\w+)\s*=\s*new URLSearchParams\(window.location.search\)\s*/,
  localP5JsRegex: /<script.*src="(?!http)([^"]*p5[^"]*\.js)"/,
  titleTagRegex: /<title>(.*?)<\/title>/,
  kodaRendererRegex: /kodahash\/render\/completed/,
  resizerRegex: /resizeCanvas\(/,
  disallowedTitle: 'KodaHash',
}

const validateCanvasCreation = (
  sketchFileContent: string,
): Result<RegExpExecArray> => {
  const canvasMatch = constants.canvasRegex.exec(sketchFileContent)
  if (!canvasMatch) {
    return { isSuccess: false, error: 'createCanvas function not found.' }
  }
  return { isSuccess: true, value: canvasMatch }
}

const validateGetURLParamsUsage = (
  sketchFileContent: string,
): Result<RegExpExecArray> => {
  const match = constants.getUrlParamsRegex.exec(sketchFileContent)
  return match
    ? { isSuccess: true, value: match }
    : { isSuccess: false, error: 'getURLParams() usage not found.' }
}

const validateURLSearchParamsUsage = (
  sketchFileContent: string,
): Result<RegExpExecArray> => {
  const match = constants.urlSearchParamsRegex.exec(sketchFileContent)
  if (match) {
    // Check if the 'hash' parameter is accessed using the captured variable name.
    const hashAccessMatch = new RegExp(
      `${match[2]}.get\\(['"\`]hash['"\`]\\)`,
    ).test(sketchFileContent)

    return hashAccessMatch
      ? { isSuccess: true, value: match }
      : {
          isSuccess: false,
          error: "URLSearchParams used but 'hash' parameter not accessed.",
        }
  }
  return { isSuccess: false, error: 'URLSearchParams usage not found.' }
}

const validateURLParamsUsage = (
  sketchFileContent: string,
): Result<RegExpExecArray> => {
  const result = validateGetURLParamsUsage(sketchFileContent)
  return result.isSuccess
    ? result
    : validateURLSearchParamsUsage(sketchFileContent)
}

const validateHtmlContent = (
  htmlFileContent: string,
): HtmlContentValidationResult => {
  const localP5jsUsed = constants.localP5JsRegex.test(htmlFileContent)
  const titleTagMatch = constants.titleTagRegex.exec(htmlFileContent)

  const titlePresent = Boolean(titleTagMatch)
  const title = titleTagMatch ? titleTagMatch[1].trim() : '-'
  const correctTitle = title !== '-' && title !== constants.disallowedTitle

  return { localP5jsUsed, titlePresent, correctTitle, title }
}

const validateSketchContent = (
  sketchFileContent: string,
  canvasMatch: RegExpExecArray,
): Pick<
  Validity,
  | 'canvasSize'
  | 'webGLSupported'
  | 'localP5jsUsed'
  | 'validTitle'
  | 'kodaRendererUsed'
  | 'resizerUsed'
> => {
  const width = canvasMatch[1].trim()
  const height = canvasMatch[2].trim()
  const isNumericWidth = /^\d+$/.test(width)
  const isNumericHeight = /^\d+$/.test(height)
  const canvasSize =
    isNumericWidth && isNumericHeight ? `${width} X ${height}` : 'Dynamic'

  return {
    canvasSize,
    webGLSupported: Boolean(
      canvasMatch[3] || constants.graphicsRegex.exec(sketchFileContent)?.[3],
    ),
    localP5jsUsed: false, // This will be set based on HTML content checks
    validTitle: false, // This will be updated after HTML content checks
    kodaRendererUsed: constants.kodaRendererRegex.test(sketchFileContent),
    resizerUsed: constants.resizerRegex.test(sketchFileContent),
  }
}

export const validate = (
  htmlFileContent: string,
  sketchFileContent: string,
): Result<InnerValidity> => {
  const canvasResult = validateCanvasCreation(sketchFileContent)
  if (!canvasResult.isSuccess) {
    return canvasResult
  }

  const paramsResult = validateURLParamsUsage(sketchFileContent)
  if (!paramsResult.isSuccess) {
    return paramsResult
  }
  const htmlValidationResult = validateHtmlContent(htmlFileContent)
  const partialValidity = validateSketchContent(
    sketchFileContent,
    canvasResult.value,
  )

  const validity: InnerValidity = {
    ...partialValidity,
    usesHashParam: paramsResult.isSuccess,
    localP5jsUsed: htmlValidationResult.localP5jsUsed,
    validTitle:
      htmlValidationResult.titlePresent && htmlValidationResult.correctTitle,
    title: htmlValidationResult.title,
  }

  return { isSuccess: true, value: validity }
}
