import { emptyObject } from '@/utils/empty';
import { hexToString, isHex } from '@polkadot/util';
import {
  RMRK,
  RmrkMint,
  RmrkView,
  RmrkEvent,
  CollectionMetadata,
  MediaType
} from './types';
import api from '@/fetch';

export const fetchRmrkMeta = async (
  rmrk: RMRK
): Promise<CollectionMetadata> => {
  try {
    const { status, data } = await api.get(sanitizeIpfsUrl(rmrk.view.metadata));
    console.log('IPFS data', status, data);
    if (status < 400) {
      return data as CollectionMetadata;
    }
  } catch (e) {
    console.warn('IPFS Err', e);
  }

  return emptyObject<CollectionMetadata>();
};

const sanitizeIpfsUrl = (ipfsUrl: string) => {
  const rr = /^ipfs:\/\//;
  if (rr.test(ipfsUrl)) {
    return ipfsUrl.replace('ipfs://', '');
  }

  return ipfsUrl;
};

export const decodeRmrkString = (rmrkString: string): RMRK => {
  const value = decode(
    isHex(rmrkString) ? hexToString(rmrkString) : rmrkString
  );

  return getRmrk(value);
};
// 'rmrk::MINTNFT::{"collection":"241B8516516F381A-OKSM","name":"Kusama Tetrahedron","transferable":1,"sn":"0000000000000002","metadata":"ipfs://ipfs/QmbT5DVZgoLP4PJRKWDRr85SowufraCgmvHehHKtkXqcEq"}';
export const getRmrk = (rmrkString: string): RMRK => {
  const action: RmrkEvent | null = getAction(rmrkString);

  if (!action) {
    console.warn('NO RMRK STRING', rmrkString);
    return emptyObject<RMRK>();
  }

  const rmrk: RMRK = emptyObject<RMRK>();
  rmrk.event = action;

  const view = getView(rmrkString);

  if (!view) {
    console.warn('NO RMRK VIEW', rmrkString);
    return emptyObject<RMRK>();
  }

  rmrk.view = view;

  return rmrk;
};

export const getAction = (rmrkString: string): RmrkEvent | null => {
  if (RmrkEventRegex.MINT.test(rmrkString)) {
    return RmrkEvent.MINT;
  }

  if (RmrkEventRegex.MINTNFT.test(rmrkString)) {
    return RmrkEvent.MINTNFT;
  }

  return null;
};

export const getView = (rmrkString: string): RmrkMint | RmrkView | null => {
  const value: RmrkMint | RmrkView | null = unwrap(rmrkString);
  return value;
};

export const unwrap = (rmrkString: string): any | null => {
  const rr: RegExp = /{.*}/;
  const match = rmrkString.match(rr);

  if (!match) {
    return null;
  }

  return JSON.parse(match[0]);
};

class RmrkEventRegex {
  static MINTNFT = /^rmrk::MINTNFT::/;
  static MINT = /^rmrk::MINT::/;
}

export const isEmpty = (rmrk: RMRK): boolean => {
  return !rmrk.event;
};

export const equals = (first: RMRK, second: RMRK): boolean => {
  if (first.event !== second.event) {
    return false;
  }

  return true;
};

export const resolveMedia = (mimeType: string): MediaType => {
  if (!mimeType) {
    return MediaType.UNKNOWN;
  }

  if (/^application\/json/.test(mimeType)) {
    return MediaType.JSON;
  }

  const match = mimeType.match(/^[a-z]+/);

  if (!match) {
    return MediaType.UNKNOWN;
  }

  const prefix = match[0].toUpperCase();

  let result = MediaType.UNKNOWN;

  Object.entries(MediaType).forEach(([type, value]) => {
    if (type === prefix) {
      result = value;
      return;
    }
  });

  return result;
};

export const decode = (value: string) => decodeURIComponent(value);
