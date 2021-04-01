import { Client, CriterionJSON, KeyInfo, Query, QueryJSON, ThreadID, Where } from '@textile/hub';
import { Collection, NFT, State, Emotion, computeAndUpdateCollection, computeAndUpdateNft, Pack, CompletePack, mergeCollection, CollectionWithMeta, NFTWithMeta, mergeNFT, Arweave } from './scheme'
import TextileService from './TextileService';
import { RmrkEvent, RMRK, RmrkInteraction } from '../types'
import NFTUtils from './NftUtils'
import { emptyObject } from '@/utils/empty';
import Consolidator, { generateId } from './Consolidator';
import { keyInfo as keysToTheKingdom } from '@/textile'
import slugify from 'slugify';
import { fetchCollectionMetadata, fetchNFTMetadata } from '../utils';
import { ipfsToArweave } from '@/pinata'

export type RmrkType = RmrkWithMetaType | Emotion | Pack
export type RmrkWithMetaType = CollectionWithMeta | NFTWithMeta
export type CollectionOrNFT = Collection | NFT

export enum AvailableCollection {
  COLLECTION = 'collection',
  NFT = 'nft',
  APPRECIATION = 'appreciation',
  PACK = 'pack'
}

export class RmrkService extends TextileService<RmrkType> implements State {
  protected _client: Client;
  // private _url: string;
  protected _dbStore: string;
  private _name: AvailableCollection = AvailableCollection.COLLECTION;

  private constructor(keyInfo: KeyInfo, url?: string) {
    super(keyInfo)
    this._client = emptyObject<Client>();
    const defaultUrl = 'bafkyp34nfouh564fd4e2m6gy33wln5wwdqescynecpfawnh7rycakly';
    // const defaultUrl = 'bafkqswn7uhcawhc74xne4zlhoebazbnsqa2n7k6yrqdt4sqedugmrsq';
    this._dbStore = url || defaultUrl;
  }

  public static async setup(keyInfo: KeyInfo, url?: string): Promise<RmrkService> {
    const rmrkService = new RmrkService(keyInfo)
    try {
      rmrkService._client = await Client.withKeyInfo(keyInfo)
      console.log(`[RMRK SETUP] has url ${url}`)
      rmrkService.onUrlChange(url)
    } catch(err) {
      throw new Error(`[RMRK SERVICE]: ${err.message}`)
    }

    return rmrkService
  }

  protected refreshContext() {
    return this._client.context.withKeyInfo(keysToTheKingdom)
  }

  public async checkExpiredOrElseRefresh() {
    console.log('checkExpiredOrElseRefresh', this.isAuthExpired)
    if (this.isAuthExpired) {
      try {
        await this.refreshContext()
      } catch (e) {
        console.error(`[RMRK] Unable to refresh context::\n ${e}`)
      }
    }
  }

  public async onUrlChange(ss58: string | undefined | number): Promise<void> {
    const name = ss58 ||(typeof ss58 === 'number' && ss58 > 0) ? String(ss58) : 'local';

    try {
      const thread = await this._client.getThread(name)
      this._dbStore = thread.id
      console.log(`[RMRK SERVICE] Connected to service <3 ${name}`)
    } catch(err) {
      console.warn(`[RMRK SERVICE] No thread with ${name}`)
      const thread = await this._client.newDB(undefined, name)
      this._dbStore = thread.toString();
    }

  }

  public storeThread() {
    return ThreadID.fromString(this._dbStore);
  }

  get collectioName(): string {
    return this._name
  }

  private useNFT() {
    this._name = AvailableCollection.NFT
  }

  private useCollection() {
    this._name = AvailableCollection.COLLECTION
  }

  private useAppreciation() {
    this._name = AvailableCollection.APPRECIATION
  }

  private usePack() {
    this._name = AvailableCollection.PACK
  }

  async getNFTsForCollection(id: string): Promise<NFTWithMeta[]> {
    this.useNFT();
    const query: QueryJSON = new Where('collection').eq(id)
    const nfts = await this.find<NFTWithMeta>(query)
    return nfts
  }

  async getNFT(id: string): Promise<NFTWithMeta> {
    this.useNFT();
    this.shouldExist(id);
    const nft = await this.getCollection<NFTWithMeta>(id)
    return nft
  }

  async getNFTsForAccount(account: string): Promise<NFTWithMeta[]> {
    this.useNFT();
    const query: QueryJSON = new Where('currentOwner').eq(account)
    const nfts = await this.find<NFTWithMeta>(query)
    return nfts
  }

  async getCollectionListForAccount(account: string): Promise<CollectionWithMeta[]> {
    this.useCollection();
    const query: QueryJSON = new Where('issuer').eq(account)
    const collections = await this.find<CollectionWithMeta>(query)
    return collections
  }

  async getPackListForAccount(account: string): Promise<Pack[]> {
    this.usePack();
    const query: QueryJSON = new Where('owner').eq(account)
    const collections = await this.find<Pack>(query)
    return collections
  }

  async getCompletePack(id: string): Promise<CompletePack> {
    this.usePack();
    try {
      const pack = await this.findById<Pack>(id);
      this.useNFT();
      const nfts = Object.keys(pack.nfts) ? await this.find<NFTWithMeta>(this.queryById(Object.keys(pack.nfts))) : [];
      // this.useCollection();
      // const collections = Object.keys(pack.collections) ? await this.find<CollectionWithMeta>(this.queryById(Object.keys(pack.collections))) : [];
      const completePack: CompletePack = {
        ...pack,
        nfts,
        collections: [],
      }

      return completePack;

    } catch (e) {
      console.warn(`[RMRK SERVICE] Complete pack failed ${e}`)
    }
    return emptyObject<CompletePack>();
  }

  async getCollectionById(id: string): Promise<CollectionWithMeta> {
    this.useCollection();
    // this.shouldExist(id);
    const collection = await this.getCollection<CollectionWithMeta>(id)
    return collection
  }

  // async getPackListByIds(account: string, ids: string[]): Promise<Pack[]> {
  //   this.usePack();
  //   const query: Query = new Query();
  //   ids.forEach(id => query.or(new Where('id').eq(id)))
  //   query.and('')
  //   const collections = await this.find<Pack>(query)
  //   return collections
  // }

  getLastSyncedBlock(): Promise<number> {
    throw new Error('Method not implemented.');
  }
  refresh(): Promise<State> {
    throw new Error('Method not implemented.');
  }

  async getAppreciationsForNFT(id: string): Promise<Emotion[]> {
    this.useNFT();
    this.shouldExist(id);
    this.useAppreciation();
    const query: QueryJSON = new Where('remarkId').eq(id)
    const appreciations = await this.find<Emotion>(query)
    return appreciations
  }

  public test(rmrkString: string): RMRK {
    try {
      const resolved: RMRK = NFTUtils.decodeAndConvert(rmrkString)
      return resolved
    } catch (e) {
      throw e
    }

  }

  public resolve(rmrkString: string, caller: string, blocknumber?: string | number): Promise<RmrkType> {
    try {
      const resolved: RMRK = NFTUtils.decodeAndConvert(rmrkString)
      switch (resolved.event) {
        case RmrkEvent.MINT:
          return this.mint(resolved.view, caller, blocknumber)
        case RmrkEvent.MINTNFT:
          return this.mintNFT(resolved.view, caller, blocknumber)
        case RmrkEvent.SEND:
          return this.send(resolved.view, caller)
        case RmrkEvent.BUY:
          return this.buy(resolved.view as RmrkInteraction, caller)
        case RmrkEvent.CONSUME:
          return this.consume(resolved.view as RmrkInteraction, caller)
        case RmrkEvent.LIST:
          return this.list(resolved.view as RmrkInteraction, caller)
        case RmrkEvent.CHANGEISSUER:
          return this.changeIssuer(resolved.view as RmrkInteraction, caller)
        case RmrkEvent.EMOTE:
          return this.appreciate(resolved.view as RmrkInteraction, caller)
        default:
          throw new EvalError(`Unable to evaluate following string, ${rmrkString}`)
      }
    } catch (e) {
      throw e
    }

  }

  public async deleteAllNFT(): Promise<string[]> {
    const nfts = await this.getAllNFTs();
    const ids = nfts.map(nft => nft._id);
    await this.remove(ids)
    return ids
  }

  public async deleteAllCollection(): Promise<string[]> {
    const collections = await this.getAllCollections();
    const ids = collections.map(el => el._id);
    await this.remove(ids)
    return ids
  }

  private async changeIssuer(view: RmrkInteraction, caller: string): Promise<CollectionWithMeta> {
    this.useCollection();

    try {
      this.shouldExist(view.id)
      const collection = await this.getCollection<CollectionWithMeta>(view.id)
      Consolidator.isIssuer(collection, caller)
      const updatedCollection: CollectionWithMeta = {
        ...collection,
        issuer: view.metadata || caller
      }
      await this.update(updatedCollection)
      return collection
    } catch (e) {
      throw e
    }
  }

  async list(view: RmrkInteraction, caller: string): Promise<NFTWithMeta> {
    if (!view.metadata) {
      throw new EvalError(`[RMRK Service] Unable to LIST ${view.id} without modifier`);
    }

    this.useNFT();
    this.shouldExist(view.id);
    const nft = await this.getCollection<NFTWithMeta>(view.id)
    Consolidator.isOwner(nft, caller)
    if (Number(view.metadata) >= 0) {
      nft.price = view.metadata
    } else {
      throw new EvalError(`[RMRK Service] Bad modifier ${view.metadata} for LIST ${view.id}`);
    }

    await this.update(nft)
    return nft
  }

  private async consume(view: RmrkInteraction, caller: string): Promise<NFTWithMeta> {
    this.useNFT();
    this.shouldExist(view.id);
    const nft = await this.getCollection<NFTWithMeta>(view.id)
    Consolidator.isOwner(nft, caller)
    await this.remove(nft._id)
    return nft
  }

  async buy(view: RmrkInteraction, caller: string): Promise<RmrkType> {
    const item = (view as RmrkInteraction);
    this.useNFT();

    try {
      await this.shouldExist(item.id)
      const nft = await this.getCollection<NFTWithMeta>(item.id)
      const updatedNft: NFTWithMeta = {
        ...nft,
        currentOwner: caller || nft.currentOwner,
        price: undefined
      }

      await this.update(updatedNft)

      return updatedNft
    } catch (e) {
      throw e
    }
  }

  async appreciate(view: RmrkInteraction, caller: string): Promise<Emotion> {
    if (!view.metadata) {
      throw ReferenceError(`[RMRK Service] Unable to appreciate without appreciation ${view.id}`)
    }

    const appreciation: Emotion = {
      _id: generateId(caller, view.id + view.metadata),
      remarkId: view.id,
      issuer: caller,
      metadata: view.metadata
    };

    this.useAppreciation();


    // Consolidator.collectionIdValid(collection, caller);

    const hasCollection = await this.hasCollection();
    if (!hasCollection) {
      await this.createCollection(appreciation)
    }

    const collectionAlreadyCreated = await this.exists(appreciation._id);

    if (collectionAlreadyCreated) {
      await this.remove(appreciation._id)
      return appreciation
      // throw ReferenceError(`[RMRK Service] Collection already created ${appreciation._id}`)
    }

    await this.addToCollection(appreciation)
    return appreciation;


  }

  private queryById(ids: string | string[]): Query {
    if (!Array.isArray(ids)) {
      return new Where('id').eq(ids)
    }

    const query = new Query();
    ids.forEach((id, index) => {
      const expr = new Where('id').eq(id);
      if (!index) {
        query.and('id').eq(id)
      } else {
        query.or(expr)
      }
    })

    return query
  }

  private async mint(view: object, caller: string, blocknumber?: string | number): Promise<CollectionWithMeta> {
    await this.checkExpiredOrElseRefresh()
    const collection = computeAndUpdateCollection(view as Collection);
    this.useCollection();

    // Consolidator.collectionIdValid(collection, caller);
    collection.issuer = caller;

    if (blocknumber) {
      collection.blockNumber = Number(blocknumber)
    }

    const collectionWithMeta = await migrateCollection(collection)

    const hasCollection = await this.hasCollection();
    if (!hasCollection) {
      await this.createCollection(collectionWithMeta)
    }

    const collectionAlreadyCreated = await this.exists(collection._id);

    if (collectionAlreadyCreated) {
      throw ReferenceError(`[RMRK Service] Collection already created ${collection._id}`)
    }

    await this.addToCollection(collectionWithMeta)
    console.log('[AR Collection] START', (new Date()).toISOString())
    this.addCollectionToArweave(collectionWithMeta)
    return collectionWithMeta;
  }

  private async mintNFT(view: object, caller: string, blocknumber?: string | number): Promise<NFTWithMeta> {
    await this.checkExpiredOrElseRefresh()
    const item = computeAndUpdateNft(view as NFT, blocknumber);
    this.useCollection();
    await this.shouldExist(item.collection);
    const collection = await this.findById<CollectionWithMeta>(item.collection);
    Consolidator.isIssuer(collection, caller)
    this.useNFT();

    item.currentOwner = caller;

    if (blocknumber) {
      item.blockNumber = Number(blocknumber)
    }

    const nft = await migrateNFT(item)

    const hasCollection = await this.hasCollection();
    if (!hasCollection) {
      await this.createCollection(nft)
    }

    const nftAlreadyCreated = await this.exists(item._id);

    if (nftAlreadyCreated) {
      throw ReferenceError(`[RMRK Service] NFT already created ${item._id}`)
    }

    await this.addToCollection(nft);
    console.log('[AR NFT] START', (new Date()).toISOString())
    this.addNFTToArweave(nft)
    return nft
  }

  private async addNFTToArweave(nft: NFTWithMeta) {
    await nftToArweave(nft).then(ar => ({ ...nft, ...ar})).then(nftWithAr => {
      console.log('[AR NFT] END', (new Date()).toISOString())
      this.useNFT();
      this.update(nftWithAr)
    })
  }

  private async addCollectionToArweave(collection: CollectionWithMeta) {
    await collectionToArweave(collection).then(ar => ({ ...collection, ...ar})).then(collectionWithAr => {
      console.log('[AR Collection] END', (new Date()).toISOString())
      this.useCollection();
      this.update(collectionWithAr)
    })
  }

  private async send(view: object, caller: string): Promise<NFTWithMeta> {
    const item = (view as RmrkInteraction);
    this.useNFT();

    try {
      await this.shouldExist(item.id)
      const nft = await this.getCollection<NFTWithMeta>(item.id)
      Consolidator.isOwner(nft, caller)
      const updatedNft: NFTWithMeta = {
        ...nft,
        currentOwner: item.metadata || nft.currentOwner,
        price: undefined
      }

      await this.update(updatedNft)

      return updatedNft
    } catch (e) {
      throw e
    }
  }

  public async createPack(pack: Partial<Pack>, caller: string): Promise<Pack> {
    this.usePack()
    if (!pack.name) {
      throw EvalError(`[RMRK Service] Unable to save pack without name, caller ${caller}`)
    }

    const id = generateId(caller, slugify(pack.name.toUpperCase(), '_'))

    const item: Pack = {
      ...pack,
      _id: pack._id || id,
      id: pack._id || id,
      name: pack.name,
      owner: caller,
      nfts: pack.nfts || {},
      collections: pack.collections || {},
    }


    // Consolidator.collectionIdValid(collection, caller);

    const hasCollection = await this.hasCollection();
    if (!hasCollection) {
      await this.createCollection(item)
    }

    const collectionAlreadyCreated = await this.exists(item._id);

    if (collectionAlreadyCreated) {
      throw ReferenceError(`[RMRK Service] Pack already created ${item._id}`)
    }

    await this.addToCollection(item)
    return item;
  }

  public async addNFTToPacks(nft: string, changeLog: Record<string, boolean>, caller: string): Promise<Record<string, boolean>> {
    const filterFn = (pack: Pack) => Object.keys(changeLog).some(packId => packId === pack._id)

    try {
      const filteredPacks = await this.getPackListForAccount(caller)
      .then(packs => packs.filter(filterFn))

      filteredPacks.forEach(pack => pack.nfts[nft] = changeLog[pack._id])
      this.usePack()
      this.update(filteredPacks)
      return changeLog
    } catch (e) {
      console.warn(`[RMRK Service] Add NFT to Packs ${e.message}`)
      return {}
    }

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

  public getAllCollections(): Promise<CollectionWithMeta[]> {
    this.useCollection()
    return this.findAll()
  }

  public getAllNFTs(): Promise<NFTWithMeta[]> {
    this.useNFT()
    return this.findAll()
  }

  public async updateCollectionWithMeta(id: string) {
    try {
      const collection = await this.getCollectionById(id)
      const final = await migrateCollection(collection)
      await this.update(final)
    } catch (e) {
      console.warn(`[RMRK Service] Unable to update collection with Meta ${e.message}`)
    }
  }

  public async updateNFTWithMeta(id: string) {
    try {
      this.useNFT();
      const nft = await this.getNFT(id)
      const final = await migrateNFT(nft)
      await this.update(final)
    } catch (e) {
      console.warn(`[RMRK Service] Unable to update collection with Meta ${e.message}`)
    }
  }

  public async isNFTAvailable(id: string, currentOwner: string): Promise<boolean> {
    try {
      this.useNFT();
      const nft = await this.getNFT(id)
      Consolidator.isOwner(nft, currentOwner)
      return true
    } catch (e) {
      return false
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


export const migrateCollection = async (collection: Collection): Promise<CollectionWithMeta> => {
  const metadata = await fetchCollectionMetadata(collection);
  const final = mergeCollection(collection, metadata);
  return final
}

export const migrateNFT = async (nft: NFT): Promise<NFTWithMeta> => {
  try {
    const metadata = await fetchNFTMetadata(nft);
    const final = mergeNFT(nft, metadata);
    return final
  } catch (e) {
    console.warn(e)
    const x = emptyObject<NFTWithMeta>();
    return { ...x, ...nft };
  }
}

export const nftToArweave = async (nft: NFTWithMeta): Promise<Arweave> => {
  const ar = emptyObject<Arweave>();
  try {
    await ipfsToArweave(nft.metadata).then(m => ar.metadataArId = m);
    nft.image && await ipfsToArweave(nft.image).then(i => ar.imageArId = i);
    nft.animation_url && await ipfsToArweave(nft.animation_url).then(a => ar.animationArId = a);
    return ar
  } catch (e) {
    console.error(`[nftToArweave] Unable to Arweave ${e.message}`)
    return ar
  }
}

export const collectionToArweave = async (collection: CollectionWithMeta): Promise<Arweave> => {
  const ar = emptyObject<Arweave>();
  try {
    await ipfsToArweave(collection.metadata).then(m => ar.metadataArId = m);
    collection.image && await ipfsToArweave(collection.image).then(i => ar.imageArId = i);
    return ar
  } catch (e) {
    console.error(`[nftToArweave] Unable to Arweave ${e.message}`)
    return ar
  }
}

