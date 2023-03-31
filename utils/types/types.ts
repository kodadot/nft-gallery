export interface KeyringPair$Meta {
  [index: string]: any
}

export interface KeyringAccount {
  address: string
  meta: KeyringPair$Meta
  publicKey: string
  type: string
}

export type LastEvent = {
  price: string
  timestamp: string
  id: string
  name: string
  issuer: string
  currentOwner: string
  metadata: string
  image: string
  animationUrl: string
  collection?: string
  collectionId?: string
  collectionName?: string
}
