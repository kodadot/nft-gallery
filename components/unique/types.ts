export interface Attribute {
  key: string;
  value: string;
}

export interface Collection {
  id: string
  issuer: string
  admin?: string
  freezer: string
  currentOwner: string
  metadata?: string
  nfts?: Instance[]
  blockNumber?: bigint
  burned: boolean
  frozen: boolean
  attributes: Attribute[]
  metadataFrozen?: boolean;
}


export interface Instance {
  id: string
  issuer: string
  currentOwner: string
  delegate?: string
  metadata?: string
  burned: boolean
  frozen: boolean
  collectionId: string
  blockNumber?: bigint
  events: [Event]
  attributes: Attribute[]
  metadataFrozen?: boolean
}
