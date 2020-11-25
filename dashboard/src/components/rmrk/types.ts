export interface Attribute {
  display_type: DisplayType;
  trait_type: string;
  value: number | string;
}

export enum DisplayType {
  null,
  "boost_number",
  "number",
  "boost_percentage",
}

export interface CollectionMetadata {
  description?: string;
  attributes: Attribute[];
  external_url?: string;
  image?: string;
  image_data?: string;
}

export interface RmrkMint {
  readonly version: string;
  readonly name: string;
  readonly max: number;
  readonly issuer: string;
  readonly symbol: string;
  readonly id: string;
  readonly metadata: string;
}

'rmrk::MINTNFT::{"collection":"241B8516516F381A-OKSM","name":"Kusama Tetrahedron","transferable":1,"sn":"0000000000000002","metadata":"ipfs://ipfs/QmbT5DVZgoLP4PJRKWDRr85SowufraCgmvHehHKtkXqcEq"}';
export interface RmrkView {
  readonly collection: string;
  readonly name: string;
  readonly instance: string;
  readonly transferable: number;
  readonly sn: string;
  readonly metadata: string;
}

export enum RmrkAction {
  MINT = 'MINT',
  MINTNFT = 'MINTNFT',
}

export interface RMRK {
  action: RmrkAction
  view: RmrkView | RmrkMint
}

