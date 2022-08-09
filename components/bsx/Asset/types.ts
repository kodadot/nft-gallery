export type AssetItem = {
  name: string
  symbol: string
  decimals: number
  balance: string | bigint
}

export type AssetListQueryResponse = {
  assetList: AssetItem[]
}
