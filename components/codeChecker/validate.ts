export type Validity = {
  canvasSize: string
  webGLSupported: boolean
  localP5jsUsed: boolean
  kodaRendererUsed: boolean
  resizerUsed: boolean
  usesHashParam: boolean
}

export const validate = (jsContent: string): [boolean, Validity?, string?] => {
  const canvasRegex = /createCanvas\((\d+),\s*(\d+)(,\s*WEBGL)?\)/
  const localP5JsRegex = /<script.*p5\.js"><\/script>/
  const paramsRegex = /\b(const|let|var)\s+(\w+)\s*=\s*getURLParams\(\)\s*/
  const kodaRendererRegex = /kodahash\/render\/completed/
  const resizerRegex = /onresize/

  // Check for canvas creation
  const canvasMatch = RegExp(canvasRegex).exec(jsContent)
  if (!canvasMatch) {
    return [false, undefined, 'createCanvas function not found.']
  }

  const paramsMatch = paramsRegex.exec(jsContent)
  if (!paramsMatch) {
    return [
      false,
      undefined,
      'Not using params please use getURLParams() in p5.js',
    ]
  }

  const variableName = paramsMatch[2]

  const validity: Validity = {
    canvasSize: `${canvasMatch[1]}x${canvasMatch[2]}`,
    webGLSupported: !!canvasMatch[3],
    localP5jsUsed: localP5JsRegex.test(jsContent),
    kodaRendererUsed: kodaRendererRegex.test(jsContent),
    resizerUsed: resizerRegex.test(jsContent),
    usesHashParam: new RegExp(`${variableName}\\.hash`).test(jsContent),
  }

  return [true, validity]
}
