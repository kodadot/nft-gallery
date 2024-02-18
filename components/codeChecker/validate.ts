import { Result, Validity } from './types'

type HtmlContentValidationResult = {
  localP5jsUsed: boolean
  titlePresent: boolean
  titleIsKodaHash: boolean
}

type InnerValidity = Omit<Validity, 'renderDurationValid'>

const constants = {
  canvasRegex: /createCanvas\(([^,]+),\s*([^)]+)(,\s*WEBGL)?\)/,
  paramsRegex: /\b(const|let|var)\s+(\w+)\s*=\s*getURLParams\(\)\s*/,
  localP5JsRegex: /<script.*src="(?!http)([^"]*p5[^"]*\.js)"/,
  titleTagRegex: /<title>(.*?)<\/title>/,
  kodaRendererRegex: /kodahash\/render\/completed/,
  resizerRegex: /resizeCanvas\(/,
  titleExpected: 'KodaHash',
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

const validateURLParamsUsage = (
  sketchFileContent: string,
): Result<RegExpExecArray> => {
  const paramsMatch = constants.paramsRegex.exec(sketchFileContent)
  if (!paramsMatch) {
    return {
      isSuccess: false,
      error: 'Not using params. Please use getURLParams() in p5.js.',
    }
  }
  return { isSuccess: true, value: paramsMatch }
}

const validateHtmlContent = (
  htmlFileContent: string,
): HtmlContentValidationResult => {
  const localP5jsUsed = constants.localP5JsRegex.test(htmlFileContent)
  const titleTagMatch = constants.titleTagRegex.exec(htmlFileContent)
  const titlePresent = Boolean(titleTagMatch)
  const titleIsKodaHash = titleTagMatch
    ? titleTagMatch[1].trim() === constants.titleExpected
    : false
  return { localP5jsUsed, titlePresent, titleIsKodaHash }
}

const validateSketchContent = (
  sketchFileContent: string,
  canvasMatch: RegExpExecArray,
  variableName: string,
): InnerValidity => {
  const width = canvasMatch[1].trim()
  const height = canvasMatch[2].trim()
  const isNumericWidth = /^\d+$/.test(width)
  const isNumericHeight = /^\d+$/.test(height)
  const canvasSize =
    isNumericWidth && isNumericHeight ? `${width} X ${height}` : 'Dynamic'

  const validity = {
    canvasSize,
    webGLSupported: !!canvasMatch[3],
    localP5jsUsed: false, // This will be set based on HTML content checks
    validTitle: false, // This will be updated after HTML content checks
    kodaRendererUsed: constants.kodaRendererRegex.test(sketchFileContent),
    resizerUsed: constants.resizerRegex.test(sketchFileContent),
    usesHashParam: new RegExp(`${variableName}\\.hash`).test(sketchFileContent),
  }
  return validity
}

export const validate = (
  htmlFileContent: string,
  sketchFileContent: string,
): Result<Omit<Validity, 'renderDurationValid'>> => {
  const canvasResult = validateCanvasCreation(sketchFileContent)
  if (!canvasResult.isSuccess) {
    return canvasResult
  }

  const paramsResult = validateURLParamsUsage(sketchFileContent)
  if (!paramsResult.isSuccess) {
    return paramsResult
  }
  const htmlValidationResult = validateHtmlContent(htmlFileContent)
  const validity = validateSketchContent(
    sketchFileContent,
    paramsResult.value,
    paramsResult.value[2],
  )

  // Update validity based on HTML content checks
  validity.localP5jsUsed = htmlValidationResult.localP5jsUsed
  validity.validTitle =
    htmlValidationResult.titlePresent && htmlValidationResult.titleIsKodaHash

  return { isSuccess: true, value: validity }
}
