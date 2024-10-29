import type { Result, Validity } from './types'
import { getDocumentFromString } from './utils'
import { AssetElementMap } from './massPreview/utils'

type HtmlContentValidationResult = {
  localP5jsUsed: boolean
  titlePresent: boolean
  correctTitle: boolean
  title: string
  externalResourcesNotUsed: boolean
}

type InnerValidity = Pick<
  Validity,
  | 'canvasSize'
  | 'localP5jsUsed'
  | 'validTitle'
  | 'kodaRendererUsed'
  | 'resizerUsed'
  | 'usesHashParam'
  | 'title'
  | 'externalResourcesNotUsed'
>

const constants = {
  canvasRegex: /createCanvas\(([^,]+?),\s*([^\s,]+?)(,\s*WEBGL)?\)/g,
  getUrlParamsRegex: /\b(const|let|var)\s+(\w+)\s*=\s*getURLParams\(\)\s*/,
  urlSearchParamsRegex:
    /\b(const|let|var)\s+(\w+)\s*=\s*new URLSearchParams\(window.location.search\)\s*/,
  localP5JsRegex: /<script.*src="(?!http)([^"]*p5[^"]*\.js)"/,
  titleTagRegex: /<title>(.*?)<\/title>/,
  kodaRendererRegex: /kodahash\/render\/completed/,
  kodaRendererCalledRegex: /(?<!function\s)postMessageKoda\s*\(/,
  resizerRegex: /resizeCanvas\(/,
  disallowedTitle: 'KodaHash',
}

const validateCanvasCreation = (
  sketchFileContent: string,
): Result<RegExpExecArray> => {
  // Create a new regex instance to avoid issues with lastIndex when using the global flag.
  const canvasMatch = new RegExp(constants.canvasRegex).exec(sketchFileContent)
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
          error: 'URLSearchParams used but \'hash\' parameter not accessed.',
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

const doesNotUseExternalResources = (htmlFileContent: string): boolean => {
  const doc = getDocumentFromString(htmlFileContent)
  const extenal: boolean[] = []

  Object.keys(AssetElementMap).forEach((asset) => {
    doc.querySelectorAll(AssetElementMap[asset].tag).forEach((tag) => {
      extenal.push(
        !tag[AssetElementMap[asset].src].includes(window.location.hostname),
      )
    })
  })

  return !extenal.some(Boolean)
}

const validateHtmlContent = (
  htmlFileContent: string,
): HtmlContentValidationResult => {
  const localP5jsUsed = constants.localP5JsRegex.test(htmlFileContent)
  const titleTagMatch = constants.titleTagRegex.exec(htmlFileContent)

  const titlePresent = Boolean(titleTagMatch)
  const title = titleTagMatch ? titleTagMatch[1].trim() : '-'
  const correctTitle = title !== '-' && title !== constants.disallowedTitle

  const externalResourcesNotUsed = doesNotUseExternalResources(htmlFileContent)

  return {
    localP5jsUsed,
    titlePresent,
    correctTitle,
    title,
    externalResourcesNotUsed,
  }
}

const validateSketchContent = (
  sketchFileContent: string,
  canvasMatch: RegExpExecArray,
): Pick<
  Validity,
  | 'canvasSize'
  | 'localP5jsUsed'
  | 'validTitle'
  | 'kodaRendererUsed'
  | 'resizerUsed'
  | 'usesHashParam'
> => {
  const width = canvasMatch[1].trim()
  const height = canvasMatch[2].trim()
  const isNumericWidth = /^\d+$/.test(width)
  const isNumericHeight = /^\d+$/.test(height)
  const canvasSize
    = isNumericWidth && isNumericHeight ? `${width} X ${height}` : 'Dynamic'

  return {
    canvasSize,
    localP5jsUsed: false, // This will be set based on HTML content checks
    validTitle: false, // This will be updated after HTML content checks
    kodaRendererUsed: constants.kodaRendererRegex.test(sketchFileContent) && constants.kodaRendererCalledRegex.test(sketchFileContent),
    resizerUsed: constants.resizerRegex.test(sketchFileContent),
    usesHashParam: validateURLParamsUsage(sketchFileContent).isSuccess,
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

  const htmlValidationResult = validateHtmlContent(htmlFileContent)
  const partialValidity = validateSketchContent(
    sketchFileContent,
    canvasResult.value,
  )

  const validity: InnerValidity = {
    ...partialValidity,
    localP5jsUsed: htmlValidationResult.localP5jsUsed,
    validTitle:
      htmlValidationResult.titlePresent && htmlValidationResult.correctTitle,
    title: htmlValidationResult.title,
    externalResourcesNotUsed: htmlValidationResult.externalResourcesNotUsed,
  }

  return { isSuccess: true, value: validity }
}
