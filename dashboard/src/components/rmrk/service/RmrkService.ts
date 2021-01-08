import { Client, KeyInfo, ThreadID } from '@textile/hub';
import { Collection, NFT, State } from './scheme'
import TextileService from './TextileService';
import { RmrkEvent, RMRK } from '../types'
import NFTUtils from './NftUtils'
import { emptyObject } from '@/utils/empty';

export type RmrkType = Collection | NFT

export class RmrkService extends TextileService<RmrkType> implements State {
  protected _client: Client;
  // private _url: string;
  protected _dbStore: string;
  private _name: string = 'collection';

  private constructor(keyInfo: KeyInfo, url?: string) {
    super(keyInfo)
    this._client = emptyObject<Client>();
    const defaultUrl = 'bafkqswn7uhcawhc74xne4zlhoebazbnsqa2n7k6yrqdt4sqedugmrsq';
    this._dbStore = url || defaultUrl;
  }

  public static async setup(keyInfo: KeyInfo, url?: string): Promise<RmrkService> {
    const rmrkService = new RmrkService(keyInfo, url)
    try {
      rmrkService._client = await Client.withKeyInfo(keyInfo)
    } catch(err) {
      throw new Error(`[RMRK SERVICE]: ${err.message}`)
    }

    return rmrkService
  }

  get collectioName(): string {
    return 'collection'
  }

  set collectioName(name: string) {
    
  }

  getNFTsForCollection(id: string): Promise<NFT[]> {
    throw new Error('Method not implemented.');
  }
  getNFT(id: string): Promise<NFT> {
    throw new Error('Method not implemented.');
  }
  getNFTsForAccount(account: string): Promise<NFT[]> {
    throw new Error('Method not implemented.');
  }
  getLastSyncedBlock(): Promise<number> {
    throw new Error('Method not implemented.');
  }
  refresh(): Promise<State> {
    throw new Error('Method not implemented.');
  }

  public resolve(rmrkString: string): Promise<RmrkType> {
    const resolved: RMRK = NFTUtils.decodeAndConvert(rmrkString)
    switch (resolved.event) {
      case RmrkEvent.MINT:
        return this.addCollection(resolved.view)
      case RmrkEvent.MINTNFT:
        return this.addItemToCollection(resolved.view)
      // case RmrkInteraction.SEND:
      //   return this.addCollection(resolved.view)
      default:
        throw new EvalError(`Unable to evaluate following string, ${rmrkString}`)
    }
  }

  private async addCollection(view: object): Promise<Collection> {
    const collection = (view as Collection);
    collection._id = collection.id;
    // await this.addToCollection(collection)
    return collection;
  }

  private async addItemToCollection(view: object): Promise<NFT> {
    const item = (view as NFT);
    // const exitsts = await this.exists(item._id)
    // if (!exitsts) {
    //   throw new ReferenceError(`Unable to find collection ${item._id}`)
    // }
    // const collection = await this.getCollection<Collection>(item._id)
    // collection.items = [ ...(collection.items || []), item ]
    // await this.update(collection);
    return item
  }

  public async joinStore(): Promise<void> {
    try {
      const info = await this.getInfo()
      await this.joinFromInfo(info)
    } catch(e) {
      console.warn(`RMRK Service ${e.message}`)
      // return await this.createDB('', this._dbStore)
    }
  }


}


let instance: RmrkService | null;

export const getInstance = (): RmrkService | null => {
  return instance
}

export const createInstance = async (keyInfo: KeyInfo, url?: string): Promise<RmrkService> => {
  if (!instance) {
    instance = await RmrkService.setup(keyInfo, url)
    // await instance.joinStore()
  }

  return instance
}
