export type AssetItem = {
  id: string
  name: string
  symbol: string
  decimals: number
  balance?: string | bigint
}

export type AssetListQueryResponse = {
  assetList: AssetItem[]
}
