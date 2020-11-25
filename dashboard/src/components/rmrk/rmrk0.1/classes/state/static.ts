import { State } from "../../types/state";
import { Collection } from "../collection";
import { NFT } from "../nft";

export class StaticState implements State {
  private filepath: string;
  constructor(filepath: string) {
    this.filepath = filepath;
  }
  getAllCollections(): Promise<Collection[]> {
    return new Promise(() => []);
  }
  getCollection(id: string): Promise<Collection> {
    return new Promise(() => []);
  }
  getLastSyncedBlock(): Promise<number> {
    return new Promise(() => []);
  }
  getNFTsForCollection(id: string): Promise<NFT[]> {
    return new Promise(() => []);
  }
  getNFT(id: string): Promise<NFT> {
    return new Promise(() => []);
  }
  getNFTsForAccount(account: string): Promise<NFT[]> {
    return new Promise(() => []);
  }
  refresh(): Promise<StaticState> {
    return new Promise(() => []);
  }
}
