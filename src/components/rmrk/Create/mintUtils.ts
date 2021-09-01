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

export function massMintParser(text: string): Record<string, MassMintNFT> {
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
      price: Number(price)
    };
  }

  return massMintNFTs;
}

export const isRangeSyntax = (text: string) => {
  const r = /^\d+-\d*\n/;
  return r.test(text);
};

function isSpecialMassMintSyntax(text: string) {
  return isRangeSyntax(text);
}

export function between(
  x: number,
  min: string | number,
  max: string | number = Infinity
) {
  return x >= min && x < max;
}

export function isMatchAll(text: string) {
  return /^\.\.\.\n/.test(text);
}

export const replaceIndex = (line: string, replaceWith: string | number) =>
  hasIndex(line) ? line.replace(/{i}/g, String(replaceWith)) : line;

const hasIndex = (line: string) => {
  const r = /{i}/;
  return r.test(line);
};

export function toRange(line: string): [number, number] | null {
  const r = /^(\d+)-(\d*)\n?$/;
  const match = r.exec(line);
  if (!match) {
    return null;
  }

  const [, min, max] = match;
  return [Number(min), Number(max) || Infinity];
}

export function fromRange(min: number, max: number) {
  return `${min}-${max === Infinity ? '' : max}`;
}
