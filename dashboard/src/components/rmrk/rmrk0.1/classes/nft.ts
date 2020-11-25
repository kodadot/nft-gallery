import { Collection } from "./collection";
import { Attribute } from "../types/attribute";

export class NFT {
  readonly collection: Collection;
  readonly name: string;
  readonly instance: string;
  readonly transferable: number;
  readonly sn: string;
  readonly metadata: NFTMetadata;
  static mintnft(): NFT {
    return new NFT();
  }
  id(): string {
    return `${this.collection.id}-${this.instance}-${this.sn}`;
  }
  send(): NFT {
    return this;
  }
  consume(): NFT {
    return this;
  }
  list(): NFT {
    return this;
  }
  buy(): NFT {
    return this;
  }
}

export interface NFTMetadata {
  external_url?: string;
  image?: string;
  image_data?: string;
  description?: string;
  name?: string;
  attributes: Attribute[];
  background_color?: string;
  animation_url?: string;
  youtube_url?: string;
}
