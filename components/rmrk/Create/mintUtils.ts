import { MassMintNFT } from '../service/scheme'
import { MediaType } from '../types'
import { resolveMedia } from '../utils'
import Connector from '@kodadot1/sub-api'
import { Attribute } from '@kodadot1/minimark'
type Range = [number, number]

export function nsfwAttribute(nsfw: boolean): Attribute[] {
  if (!nsfw) {
    return []
  }

  return [{ trait_type: 'NSFW', value: Number(nsfw) }]
}

export function offsetAttribute(hasCarbonOffset: boolean): Attribute[] {
  if (!hasCarbonOffset) {
    return []
  }

  return [{ trait_type: 'carbonless', value: Number(hasCarbonOffset) }]
}

export function secondaryFileVisible(file?: Blob): boolean {
  const fileType = resolveMedia(file?.type)
  return isFileWithoutType(file, fileType) || isSecondFileVisible(fileType)
}

export function isSecondFileVisible(fileType: MediaType): boolean {
  return ![MediaType.UNKNOWN, MediaType.IMAGE].some((t) => t === fileType)
}

export function isFileWithoutType(
  file: Blob | unknown,
  mediaType: MediaType
): boolean {
  return Boolean(file && mediaType === MediaType.UNKNOWN)
}

export function toRemark(rmrk: string | string[]) {
  const { api } = Connector.getInstance()
  const remark = api.tx.system.remark

  if (Array.isArray(rmrk)) {
    return rmrk.map(remark)
  }

  return remark(rmrk)
}

export function massMintParser(text: string): Record<string, MassMintNFT> {
  let lines = text.split('\n')
  let index = lines.indexOf('')
  const res: string[][] = []
  while (index !== -1) {
    res.push(lines.slice(0, index))
    lines = lines.slice(index + 1)
    index = lines.indexOf('')
  }

  res.push(lines)

  return toMassMint(res)
}

function toMassMint(mints: string[][]) {
  const massMintNFTs: Record<string, MassMintNFT> = {}
  for (const mint of mints) {
    if (mint.length < 4) {
      console.error(`Invalid mint: ${mint.length}`)
      continue
    }

    const [fileName, name, price, ...rest] = mint

    massMintNFTs[fileName] = {
      name,
      description: rest.join('\n'),
      meta: Number(price),
    }
  }

  return massMintNFTs
}

export const isRangeSyntax = (text: string): boolean => {
  const r = /^\d+-\d*\n/
  return r.test(text)
}

export function between(
  x: number,
  min: string | number,
  max: string | number = Infinity
): boolean {
  return x >= min && x <= max
}

export function isMatchAll(text: string): boolean {
  return /^\.\.\.\n/.test(text)
}

export const replaceIndex = (
  line: string,
  replaceWith: string | number
): string => (hasIndex(line) ? line.replace(/{i}/g, String(replaceWith)) : line)

const hasIndex = (line: string) => {
  const r = /{i}/
  return r.test(line)
}

export const skipProcess = (line: string): boolean => {
  const r = /^-/
  return r.test(line)
}

const correctText = (original: string, parsed: string): string => {
  if (skipProcess(parsed)) {
    return original
  }

  return parsed
}

export function toRange(line: string): Range | null {
  const r = /^(\d+)-(\d*)\n?$/
  const match = r.exec(line)
  if (!match) {
    return null
  }

  const [, min, max] = match
  return [Number(min), Number(max) || Infinity]
}

export function fromRange(min: number, max: number): string {
  return `${min}-${max === Infinity ? '' : max}`
}

export function getRange(parsed: Record<string, MassMintNFT>): Range[] {
  return Object.keys(parsed).map(toRange).filter(Boolean) as Range[]
}

export function processRangeSyntax(
  massMints: MassMintNFT[],
  parsed: Record<string, MassMintNFT>
): MassMintNFT[] {
  const ranges = getRange(parsed)
  return massMints.map((item, index) => {
    const range = ranges.find(([min, max]) => between(index + 1, min, max))
    if (range) {
      const key = fromRange(...range)
      const parsedItem = parsed[key]
      return {
        ...item,
        ...parsedItem,
        description: replaceIndex(
          correctText(item.description, parsedItem.description),
          index + 1
        ),
        name: replaceIndex(correctText(item.name, parsedItem.name), index + 1),
      }
    }
    return item
  })
}

export function processMatchAllSyntax(
  massMints: MassMintNFT[],
  parsed: Record<string, MassMintNFT>
): MassMintNFT[] {
  const applyForAll = parsed['...']
  return massMints.map((item, index) => ({
    ...item,
    ...applyForAll,
    description: replaceIndex(
      correctText(item.description, applyForAll.description),
      index + 1
    ),
    name: replaceIndex(correctText(item.name, applyForAll.name), index + 1),
  }))
}

export function processFiles(files: File[]): MassMintNFT[] {
  return files.map<MassMintNFT>((file) => ({
    name: file.name,
    description: '',
    meta: 0,
    file,
  }))
}
