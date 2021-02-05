import { RmrkType } from './RmrkService';
import { RmrkInteraction } from '../types';
import { Collection, NFT } from './scheme';
import { u8aToHex } from '@polkadot/util';
import { decodeAddress } from '@polkadot/keyring';

// const collectionSchema: Record<keyof Collection, string> = {
//   version: 'string',
//   name: 'string',
//   max: 'number',
//   issuer: 'string',
//   symbol: 'string',
//   id: 'string',
//   _id: 'string',
//   metadata: 'string',
// }

export default class Consolidator {
  public static isPermitedInteraction(): boolean {
    return true;
  }

  public static canTransfer(nft: NFT) {
    if (!nft.transferable) {
      throw new ValidationError(`NFT ${nft._id} is not transferable`);
    }
  }

  // private static canBuy() {

  // }

  // private static canMintNft() {

  // }

  // private static canSend() {

  // }

  // private static canList() {

  // }

  // private static canChangeIssuer() {

  // }

  // public static isValidCollection() {

  // }

  public static collectionIdValid(collection: Collection, caller: string) {
    const generatedId = caller.startsWith('0x') ? caller : generateId(
      accountIdToPubKey(caller),
      collection.symbol
    );
    if (!Consolidator.callerEquals(collection._id, generatedId)) {
      throw new ValidationError(
        `Collection id missmatch ${collection._id} vs ${generatedId}`
      );
    }
  }

  public static test(
    rmrk: RmrkType,
    interaction: RmrkInteraction,
    caller: string
  ): boolean {
    return true;
  }

  // public static validate() {}

  public static requireCaller(caller = '', interaction: RmrkInteraction) {
    if (!caller) {
      throw new ValidationError(
        `Unknown caller, doing ${interaction.toString()}`
      );
    }
  }

  public static isIssuer(collection: Collection, caller = '') {
    if (!Consolidator.callerEquals(collection.issuer, caller)) {
      throw new ValidationError(
        `Caller ${caller} is not issuer of ${collection._id}.\n Issuer is ${collection.issuer}!`
      );
    }
  }

  public static isOwner(nft: NFT, caller = '') {
    if (!Consolidator.callerEquals(nft.currentOwner, caller)) {
      throw new ValidationError(
        `Caller ${caller} is not owner of ${nft._id}.\n Owner is ${nft.currentOwner}!`
      );
    }
  }

  private static callerEquals(ownerId: string, caller: string): boolean {
    return ownerId === caller;
  }
}

function accountIdToPubKey(accountId: string) {
  return (accountId && u8aToHex(decodeAddress(accountId))) || '';
}

export function generateId(pubkey: string, symbol: string): string {
  return (
    pubkey?.substr(2, 10) +
    pubkey?.substring(pubkey.length - 8) +
    '-' +
    (symbol || '')
  ).toUpperCase();
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
