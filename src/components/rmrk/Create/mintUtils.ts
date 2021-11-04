import { Attribute } from '../service/scheme'
import { MediaType } from '../types'
import { resolveMedia } from '../utils'
import Connector from '@vue-polkadot/vue-api'

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
  return ![MediaType.UNKNOWN, MediaType.IMAGE].some(t => t === fileType)
}

export function isFileWithoutType(file: Blob | unknown, mediaType: MediaType): boolean {
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
