import { Attribute, MassMintNFT } from '../service/scheme';
import { MediaType } from '../types';
import { resolveMedia } from '../utils';
import Connector from '@vue-polkadot/vue-api';
import store from '@/store';

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

export function toRemark(rmrk: string | string[]) {
  const { api } = Connector.getInstance();
  const remark = api.tx.system.remark;

  if (Array.isArray(rmrk)) {
    return rmrk.map(remark);
  }

  return remark(rmrk);
}

export function massMintParser(text: string): any {
  let lines = text.split('\n');
  let index = lines.indexOf('');
  const res: string[][] = [];
  while (index !== -1) {
    res.push(lines.slice(0, index));
    lines = lines.slice(index + 1);
    index = lines.indexOf('');
  }

  res.push(lines);

  return toMassMint(res);
}

function toMassMint(mints: string[][]) {
  const massMintNFTs: Record<string, MassMintNFT> = {};
  for (const mint of mints) {
    if (mint.length < 4) {
      console.warn(`Invalid mint: ${mint}`);
      continue;
    }

    const [fileName, name, price, ...rest] = mint;

    massMintNFTs[fileName] = {
      name,
      description: rest.join('\n'),
      price: Number(price) * 10 ** 12
    };
  }

  return massMintNFTs;
}
