import { State } from "../types/state";
import { ApiPromise } from "@polkadot/api";
import { NFT } from "../classes/nft";
import { Collection } from "../classes/collection";

export class RMRK {
  static version = 0.1;
  public state: State;
  private api: ApiPromise;
  public constructor(state: State, api: ApiPromise) {
    this.state = state;
    this.api = api;
  }
  public persist = async function (set: []): Promise<boolean> {
    return true;
  };
}
