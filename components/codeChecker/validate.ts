export type Passed = boolean | 'loading' | 'unknown'

export type Validity = {
  canvasSize: string
  webGLSupported: boolean
  localP5jsUsed: boolean
  kodaRendererUsed: Passed
  resizerUsed: boolean
  usesHashParam: boolean
  validTitle: boolean
  renderDurationValid: Passed
}

export const validate = (
  htmlFileContent: string,
  sketchFileContent: string,
): [boolean, Omit<Validity, 'renderDurationValid'>?, string?] => {
  const canvasRegex = /createCanvas\(([^,]+),\s*([^)]+)(,\s*WEBGL)?\)/
  const localP5JsRegex = /<script.*src="(?!http)([^"]*p5[^"]*\.js)"/
  const paramsRegex = /\b(const|let|var)\s+(\w+)\s*=\s*getURLParams\(\)\s*/
  const kodaRendererRegex = /kodahash\/render\/completed/
  const resizerRegex = /resizeCanvas\(/
  const titleTagRegex = /<title>(.*?)<\/title>/

  // Check for canvas creation
  const canvasMatch = RegExp(canvasRegex).exec(sketchFileContent)
  if (!canvasMatch) {
    return [false, undefined, 'createCanvas function not found.']
  }

  const paramsMatch = paramsRegex.exec(sketchFileContent)
  if (!paramsMatch) {
    return [
      false,
      undefined,
      'Not using params please use getURLParams() in p5.js',
    ]
  }

  // HTML content checks
  const titleTagMatch = titleTagRegex.exec(htmlFileContent)
  const localP5jsUsed = localP5JsRegex.test(htmlFileContent)
  const titlePresent = Boolean(titleTagMatch)
  const titleIsKodaHash = titleTagMatch
    ? titleTagMatch[1].trim() === 'KodaHash'
    : false

  const variableName = paramsMatch[2]

  const validity: Omit<Validity, 'renderDurationValid'> = {
    canvasSize: `${canvasMatch[1]} X ${canvasMatch[2]}`,
    webGLSupported: !!canvasMatch[3],
    localP5jsUsed,
    validTitle: titlePresent && titleIsKodaHash,
    kodaRendererUsed: kodaRendererRegex.test(sketchFileContent),
    resizerUsed: resizerRegex.test(sketchFileContent),
    usesHashParam: new RegExp(`${variableName}\\.hash`).test(sketchFileContent),
  }

  return [true, validity]
}
