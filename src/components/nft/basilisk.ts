export default {
  AssetPair: {
    asset_in: 'AssetId',
    asset_out: 'AssetId'
  },
  Amount: 'i128',
  AmountOf: 'Amount',
  Address: 'AccountId',
  OrmlAccountData: {
    free: 'Balance',
    frozen: 'Balance',
    reserved: 'Balance'
  },
  Fee: {
    numerator: 'u32',
    denominator: 'u32'
  },
  BalanceInfo: {
    amount: 'Balance',
    assetId: 'AssetId'
  },
  Chain: {
    genesisHash: 'Vec<u8>',
    lastBlockHash: 'Vec<u8>'
  },
  CurrencyId: 'AssetId',
  CurrencyIdOf: 'AssetId',
  Intention: {
    who: 'AccountId',
    asset_sell: 'AssetId',
    asset_buy: 'AssetId',
    amount: 'Balance',
    discount: 'bool',
    sell_or_buy: 'IntentionType'
  },
  IntentionId: 'Hash',
  IntentionType: {
    _enum: ['SELL', 'BUY']
  },
  LookupSource: 'AccountId',
  Price: 'Balance',
  ClassId: 'u64',
  TokenId: 'u64',
  ClassData: {
    name: 'Vec<u8>',
    max: 'u16',
    symbol: 'Vec<u8>',
    is_pool: 'bool'
  },
  TokenData: {
    locked: 'bool',
    emote: 'Vec<u8>'
  },
  CID: 'Vec<u8>',
  ClassInfo: {
    metadata: 'Vec<u8>',
    total_issuance: 'TokenId',
    owner: 'AccountId',
    data: 'ClassData'
  },
  TokenInfo: {
    metadata: 'Vec<u8>',
    owner: 'AccountId',
    data: 'TokenData'
  },
  ClassInfoOf: 'ClassInfo',
  TokenInfoOf: 'TokenInfo',
  ClassIdOf: 'ClassId',
  TokenIdOf: 'TokenId',
  OrderedSet: 'Vec<AssetId>',
  VestingSchedule: {
    start: 'BlockNumber',
    period: 'BlockNumber',
    period_count: 'u32',
    per_period: 'Compact<Balance>'
  },
  VestingScheduleOf: 'VestingSchedule',
  PoolId: 'AccountId'
};
