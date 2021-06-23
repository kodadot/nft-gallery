import { Attribute } from '../service/scheme';
import { MediaType } from '../types';
import { resolveMedia } from '../utils';

export function nsfwAttribute(nsfw: boolean): Attribute[] {
  if (!nsfw) {
    return [];
  }

  return [{ trait_type: 'NSFW', value: Number(nsfw) }];
}

export function offsetAttribute(hasCarbonOffset: boolean): Attribute[] {
  if (!hasCarbonOffset) {
    return [];
  }

  return [{ trait_type: 'carbonless', value: Number(hasCarbonOffset) }];
}

export function secondaryFileVisible(file?: Blob) {
  const fileType = resolveMedia(file?.type);
  return ![MediaType.UNKNOWN, MediaType.IMAGE].some(t => t === fileType);
}
