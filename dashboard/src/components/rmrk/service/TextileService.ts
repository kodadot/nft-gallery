import { Client, DBInfo, KeyInfo, ThreadID, QueryJSON } from '@textile/hub'
// import ConstructError from './ConstructError';


/**
 * TextileService
 * @constructor
 * keyInfo from textile (generate using Textile Hub CLI)
 *
 */
export default abstract class TextileService<T> {
  private _keyInfo: KeyInfo | null;
  protected abstract _client: Client;
  protected abstract _dbStore: string;

  constructor(keyInfo: KeyInfo) {
    this._keyInfo = keyInfo;

  }

  get client(): Client {
    return this._client;
  }

  get store(): ThreadID {
    return TextileService.threadId(this._dbStore)
  }


  abstract get collectioName(): string;
  abstract set collectioName(name: string);
  

  private createCollection(schema: T): Promise<void> {
    return this.client.newCollectionFromObject(this.store, schema, { name: this.collectioName })
  }

  protected async addToCollection(object: T) {
    const hasCollection = await this.hasCollection();
    if (!hasCollection) {
      await this.createCollection(object)
    }

    await this.client.create(this.store, this.collectioName, [ object ])
  }

  protected async update(object: T) {
    await this.client.save(this.store, this.collectioName, [ object ])
  }


  protected async getInfo(): Promise<DBInfo> {
    return await this.client.getDBInfo(this.store)
  }

  protected async joinFromInfo(info: DBInfo) {
    return await this.client.joinFromInfo(info)
  }

  protected async createDB(url: string, threadId?: string): Promise<ThreadID> {
    this.hasClient();

    return this.client.newDB(threadId ? TextileService.threadId(threadId) : undefined, url)
  }

  private hasClient() {
    if (!this.client) {
      throw Error('[TextileService] No Client available')
    }
  }

  public exists(id: string | string[]): Promise<boolean> {
    return this.client.has(this.store, this.collectioName, Array.isArray(id) ? id : [id])
  }

  public async shouldExist(id: string | string[]): Promise<void> {
    const has = await this.exists(id)

    if (!has) {
      throw ReferenceError(`[TextileService] No object with not found with id ${id}`)
    }
  }

  public static threadId(id: string): ThreadID {
    return ThreadID.fromString(id)
  }

  getCollection<U>(id: string): Promise<U> {
    return this.client.findByID(this.store, this.collectioName, id)
  }

  getAllCollections<U>(): Promise<U[]> {
    throw new Error('Method not implemented.');
    // return this.client.find(this.store, this.collectioName, undefined)
  }

  private async hasCollection(): Promise<boolean> {
    try {
      await this.client.getCollectionInfo(this.store, this.collectioName)
      return true
    } catch(e) {
      return false
    }


  }

}

// let instance: TextileService<T> | null;

// export const getInstance = (): TextileService | null => {
//   return instance
// }

// export const createInstance = (keyInfo: KeyInfo): TextileService => {
//   if (!instance) {
//     instance = new TextileService(keyInfo)
//   }

//   return instance
// }
