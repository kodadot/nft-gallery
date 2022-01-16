export interface NFTFragment extends MetaFragment {
  id: string
  issuer: string
  currentOwner: string
  blockNumber?: number
  collectionId: string
  burned?: boolean
}

export interface MetaFragment {
  metadata: string
}

export interface NFTWithCollectionMeta extends NFTFragment {
  collection: MetaFragment
}

export interface NFTEntity<T> {
  nFTEntity: T
}

export interface NFTEntities<T> {
  nFTEntities: {
    nodes: T[]
  }
}
