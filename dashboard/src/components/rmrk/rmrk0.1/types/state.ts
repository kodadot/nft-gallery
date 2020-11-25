import { Collection } from "../classes/collection";
import { NFT } from "../classes/nft";

export interface State {
  getAllCollections(): Promise<Collection[]>;
  getNFTsForCollection(id: string): Promise<NFT[]>;
  getNFT(id: string): Promise<NFT>;
  getCollection(id: string): Promise<Collection>;
  getNFTsForAccount(account: string): Promise<NFT[]>;
  getLastSyncedBlock(): Promise<number>;
  refresh(): Promise<State>;
}
