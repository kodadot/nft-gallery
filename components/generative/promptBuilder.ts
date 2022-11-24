export type Options = {
  gender: string
  vibe: string
  framing: string
  filmType: string
  style: string
  inspiredBy: string
  having: string
  wearing: string
  art: string
  lighting: string
}

const OF = 'of'
const BY = 'by'
const COMMA = ','

export const buildPrompt = (options: Options): string => {
  const { gender, framing, art, style, having, wearing, lighting, inspiredBy } =
    options
  const prompt = [
    framing,
    style || '',
    art,
    OF,
    gender,
    having ? `having ${having}${COMMA}` : '',
    wearing ? `wearing ${wearing}${COMMA}` : '',
    lighting ? `${lighting} lighting${COMMA}` : '',
    inspiredBy ? `${BY} ${inspiredBy}` : '',
  ]
    .filter((x) => x !== '')
    .join(' ')
    .replace(/,\s*$/, '')
  return prompt
  // const { gender, framing, art, style } = options
  // return `${framing} ${style || ''} ${art} of ${gender} ${having} ${wearing}`
}

export const buildDescription = (prompt: string): string => {
  return prompt
}
