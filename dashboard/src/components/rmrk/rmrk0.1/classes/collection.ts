import { Attribute } from "../types/attribute";

export class Collection {
  readonly version: string;
  readonly name: string;
  readonly max: number;
  private issuer: string;
  readonly symbol: string;
  readonly id: string;
  readonly metadata: CollectionMetadata;
  static mint(): Collection {
    return new Collection();
  }
  change_issuer(): Collection {
    return this;
  }
}

export interface CollectionMetadata {
  description?: string;
  attributes: Attribute[];
  external_url?: string;
  image?: string;
  image_data?: string;
}
