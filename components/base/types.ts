export type BaseMintedCollection = {
  id: string
  alreadyMinted: number
  metadata: string
  name?: string
}

export type BaseTokenType<T = BaseMintedCollection> = {
  name: string
  file: File | null
  description: string
  selectedCollection: T | null
  edition: number
  secondFile: File | null
}
