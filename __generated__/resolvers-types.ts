import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigInt: { input: any; output: any; }
  DateTime: { input: any; output: any; }
};

export type AssetEntitiesConnection = {
  __typename?: 'AssetEntitiesConnection';
  edges: Array<AssetEntityEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AssetEntity = {
  __typename?: 'AssetEntity';
  decimals?: Maybe<Scalars['Int']['output']>;
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  symbol?: Maybe<Scalars['String']['output']>;
};

export type AssetEntityEdge = {
  __typename?: 'AssetEntityEdge';
  cursor: Scalars['String']['output'];
  node: AssetEntity;
};

export enum AssetEntityOrderByInput {
  DecimalsAsc = 'decimals_ASC',
  DecimalsDesc = 'decimals_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  SymbolAsc = 'symbol_ASC',
  SymbolDesc = 'symbol_DESC'
}

export type AssetEntityWhereInput = {
  AND?: InputMaybe<Array<AssetEntityWhereInput>>;
  OR?: InputMaybe<Array<AssetEntityWhereInput>>;
  decimals_eq?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  decimals_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_eq?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  name_endsWith?: InputMaybe<Scalars['String']['input']>;
  name_eq?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  name_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  name_not_eq?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  name_startsWith?: InputMaybe<Scalars['String']['input']>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  symbol_endsWith?: InputMaybe<Scalars['String']['input']>;
  symbol_eq?: InputMaybe<Scalars['String']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  symbol_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  symbol_not_eq?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  symbol_startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type Attribute = {
  __typename?: 'Attribute';
  display?: Maybe<Scalars['String']['output']>;
  trait?: Maybe<Scalars['String']['output']>;
  value: Scalars['String']['output'];
};

export type Cheapest = {
  __typename?: 'Cheapest';
  currentOwner?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['BigInt']['output']>;
};

export type Collection = {
  __typename?: 'Collection';
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type CollectionEntitiesConnection = {
  __typename?: 'CollectionEntitiesConnection';
  edges: Array<CollectionEntityEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type CollectionEntity = {
  __typename?: 'CollectionEntity';
  attributes?: Maybe<Array<Attribute>>;
  blockNumber?: Maybe<Scalars['BigInt']['output']>;
  burned: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  currentOwner: Scalars['String']['output'];
  distribution: Scalars['Int']['output'];
  events: Array<CollectionEvent>;
  floor: Scalars['BigInt']['output'];
  hash: Scalars['String']['output'];
  highestSale: Scalars['BigInt']['output'];
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  issuer: Scalars['String']['output'];
  max?: Maybe<Scalars['Int']['output']>;
  media?: Maybe<Scalars['String']['output']>;
  meta?: Maybe<MetadataEntity>;
  metadata?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  nftCount: Scalars['Int']['output'];
  nfts: Array<NftEntity>;
  ownerCount: Scalars['Int']['output'];
  recipient?: Maybe<Scalars['String']['output']>;
  royalty?: Maybe<Scalars['Float']['output']>;
  supply: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  version: Scalars['Int']['output'];
  volume: Scalars['BigInt']['output'];
};


export type CollectionEntityEventsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CollectionEventOrderByInput>>;
  where?: InputMaybe<CollectionEventWhereInput>;
};


export type CollectionEntityNftsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<NftEntityOrderByInput>>;
  where?: InputMaybe<NftEntityWhereInput>;
};

export type CollectionEntityEdge = {
  __typename?: 'CollectionEntityEdge';
  cursor: Scalars['String']['output'];
  node: CollectionEntity;
};

export enum CollectionEntityOrderByInput {
  BlockNumberAsc = 'blockNumber_ASC',
  BlockNumberDesc = 'blockNumber_DESC',
  BurnedAsc = 'burned_ASC',
  BurnedDesc = 'burned_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  CurrentOwnerAsc = 'currentOwner_ASC',
  CurrentOwnerDesc = 'currentOwner_DESC',
  DistributionAsc = 'distribution_ASC',
  DistributionDesc = 'distribution_DESC',
  FloorAsc = 'floor_ASC',
  FloorDesc = 'floor_DESC',
  HashAsc = 'hash_ASC',
  HashDesc = 'hash_DESC',
  HighestSaleAsc = 'highestSale_ASC',
  HighestSaleDesc = 'highestSale_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  ImageAsc = 'image_ASC',
  ImageDesc = 'image_DESC',
  IssuerAsc = 'issuer_ASC',
  IssuerDesc = 'issuer_DESC',
  MaxAsc = 'max_ASC',
  MaxDesc = 'max_DESC',
  MediaAsc = 'media_ASC',
  MediaDesc = 'media_DESC',
  MetaAnimationUrlAsc = 'meta_animationUrl_ASC',
  MetaAnimationUrlDesc = 'meta_animationUrl_DESC',
  MetaBannerAsc = 'meta_banner_ASC',
  MetaBannerDesc = 'meta_banner_DESC',
  MetaDescriptionAsc = 'meta_description_ASC',
  MetaDescriptionDesc = 'meta_description_DESC',
  MetaIdAsc = 'meta_id_ASC',
  MetaIdDesc = 'meta_id_DESC',
  MetaImageAsc = 'meta_image_ASC',
  MetaImageDesc = 'meta_image_DESC',
  MetaNameAsc = 'meta_name_ASC',
  MetaNameDesc = 'meta_name_DESC',
  MetaTypeAsc = 'meta_type_ASC',
  MetaTypeDesc = 'meta_type_DESC',
  MetadataAsc = 'metadata_ASC',
  MetadataDesc = 'metadata_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  NftCountAsc = 'nftCount_ASC',
  NftCountDesc = 'nftCount_DESC',
  OwnerCountAsc = 'ownerCount_ASC',
  OwnerCountDesc = 'ownerCount_DESC',
  RecipientAsc = 'recipient_ASC',
  RecipientDesc = 'recipient_DESC',
  RoyaltyAsc = 'royalty_ASC',
  RoyaltyDesc = 'royalty_DESC',
  SupplyAsc = 'supply_ASC',
  SupplyDesc = 'supply_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
  VersionAsc = 'version_ASC',
  VersionDesc = 'version_DESC',
  VolumeAsc = 'volume_ASC',
  VolumeDesc = 'volume_DESC'
}

export type CollectionEntityWhereInput = {
  AND?: InputMaybe<Array<CollectionEntityWhereInput>>;
  OR?: InputMaybe<Array<CollectionEntityWhereInput>>;
  attributes_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  blockNumber_eq?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  burned_eq?: InputMaybe<Scalars['Boolean']['input']>;
  burned_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  burned_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  createdAt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  currentOwner_contains?: InputMaybe<Scalars['String']['input']>;
  currentOwner_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  currentOwner_endsWith?: InputMaybe<Scalars['String']['input']>;
  currentOwner_eq?: InputMaybe<Scalars['String']['input']>;
  currentOwner_gt?: InputMaybe<Scalars['String']['input']>;
  currentOwner_gte?: InputMaybe<Scalars['String']['input']>;
  currentOwner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  currentOwner_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  currentOwner_lt?: InputMaybe<Scalars['String']['input']>;
  currentOwner_lte?: InputMaybe<Scalars['String']['input']>;
  currentOwner_not_contains?: InputMaybe<Scalars['String']['input']>;
  currentOwner_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  currentOwner_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  currentOwner_not_eq?: InputMaybe<Scalars['String']['input']>;
  currentOwner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  currentOwner_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  currentOwner_startsWith?: InputMaybe<Scalars['String']['input']>;
  distribution_eq?: InputMaybe<Scalars['Int']['input']>;
  distribution_gt?: InputMaybe<Scalars['Int']['input']>;
  distribution_gte?: InputMaybe<Scalars['Int']['input']>;
  distribution_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  distribution_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  distribution_lt?: InputMaybe<Scalars['Int']['input']>;
  distribution_lte?: InputMaybe<Scalars['Int']['input']>;
  distribution_not_eq?: InputMaybe<Scalars['Int']['input']>;
  distribution_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  events_every?: InputMaybe<CollectionEventWhereInput>;
  events_none?: InputMaybe<CollectionEventWhereInput>;
  events_some?: InputMaybe<CollectionEventWhereInput>;
  floor_eq?: InputMaybe<Scalars['BigInt']['input']>;
  floor_gt?: InputMaybe<Scalars['BigInt']['input']>;
  floor_gte?: InputMaybe<Scalars['BigInt']['input']>;
  floor_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  floor_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  floor_lt?: InputMaybe<Scalars['BigInt']['input']>;
  floor_lte?: InputMaybe<Scalars['BigInt']['input']>;
  floor_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  floor_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  hash_endsWith?: InputMaybe<Scalars['String']['input']>;
  hash_eq?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  hash_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  hash_not_eq?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  hash_startsWith?: InputMaybe<Scalars['String']['input']>;
  highestSale_eq?: InputMaybe<Scalars['BigInt']['input']>;
  highestSale_gt?: InputMaybe<Scalars['BigInt']['input']>;
  highestSale_gte?: InputMaybe<Scalars['BigInt']['input']>;
  highestSale_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  highestSale_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  highestSale_lt?: InputMaybe<Scalars['BigInt']['input']>;
  highestSale_lte?: InputMaybe<Scalars['BigInt']['input']>;
  highestSale_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  highestSale_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  image_contains?: InputMaybe<Scalars['String']['input']>;
  image_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  image_endsWith?: InputMaybe<Scalars['String']['input']>;
  image_eq?: InputMaybe<Scalars['String']['input']>;
  image_gt?: InputMaybe<Scalars['String']['input']>;
  image_gte?: InputMaybe<Scalars['String']['input']>;
  image_in?: InputMaybe<Array<Scalars['String']['input']>>;
  image_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  image_lt?: InputMaybe<Scalars['String']['input']>;
  image_lte?: InputMaybe<Scalars['String']['input']>;
  image_not_contains?: InputMaybe<Scalars['String']['input']>;
  image_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  image_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  image_not_eq?: InputMaybe<Scalars['String']['input']>;
  image_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  image_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  image_startsWith?: InputMaybe<Scalars['String']['input']>;
  issuer_contains?: InputMaybe<Scalars['String']['input']>;
  issuer_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  issuer_endsWith?: InputMaybe<Scalars['String']['input']>;
  issuer_eq?: InputMaybe<Scalars['String']['input']>;
  issuer_gt?: InputMaybe<Scalars['String']['input']>;
  issuer_gte?: InputMaybe<Scalars['String']['input']>;
  issuer_in?: InputMaybe<Array<Scalars['String']['input']>>;
  issuer_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  issuer_lt?: InputMaybe<Scalars['String']['input']>;
  issuer_lte?: InputMaybe<Scalars['String']['input']>;
  issuer_not_contains?: InputMaybe<Scalars['String']['input']>;
  issuer_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  issuer_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  issuer_not_eq?: InputMaybe<Scalars['String']['input']>;
  issuer_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  issuer_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  issuer_startsWith?: InputMaybe<Scalars['String']['input']>;
  max_eq?: InputMaybe<Scalars['Int']['input']>;
  max_gt?: InputMaybe<Scalars['Int']['input']>;
  max_gte?: InputMaybe<Scalars['Int']['input']>;
  max_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  max_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  max_lt?: InputMaybe<Scalars['Int']['input']>;
  max_lte?: InputMaybe<Scalars['Int']['input']>;
  max_not_eq?: InputMaybe<Scalars['Int']['input']>;
  max_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  media_contains?: InputMaybe<Scalars['String']['input']>;
  media_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  media_endsWith?: InputMaybe<Scalars['String']['input']>;
  media_eq?: InputMaybe<Scalars['String']['input']>;
  media_gt?: InputMaybe<Scalars['String']['input']>;
  media_gte?: InputMaybe<Scalars['String']['input']>;
  media_in?: InputMaybe<Array<Scalars['String']['input']>>;
  media_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  media_lt?: InputMaybe<Scalars['String']['input']>;
  media_lte?: InputMaybe<Scalars['String']['input']>;
  media_not_contains?: InputMaybe<Scalars['String']['input']>;
  media_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  media_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  media_not_eq?: InputMaybe<Scalars['String']['input']>;
  media_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  media_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  media_startsWith?: InputMaybe<Scalars['String']['input']>;
  meta?: InputMaybe<MetadataEntityWhereInput>;
  meta_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  metadata_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  metadata_endsWith?: InputMaybe<Scalars['String']['input']>;
  metadata_eq?: InputMaybe<Scalars['String']['input']>;
  metadata_gt?: InputMaybe<Scalars['String']['input']>;
  metadata_gte?: InputMaybe<Scalars['String']['input']>;
  metadata_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  metadata_lt?: InputMaybe<Scalars['String']['input']>;
  metadata_lte?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  metadata_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  metadata_not_eq?: InputMaybe<Scalars['String']['input']>;
  metadata_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  metadata_startsWith?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  name_endsWith?: InputMaybe<Scalars['String']['input']>;
  name_eq?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  name_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  name_not_eq?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  name_startsWith?: InputMaybe<Scalars['String']['input']>;
  nftCount_eq?: InputMaybe<Scalars['Int']['input']>;
  nftCount_gt?: InputMaybe<Scalars['Int']['input']>;
  nftCount_gte?: InputMaybe<Scalars['Int']['input']>;
  nftCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  nftCount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  nftCount_lt?: InputMaybe<Scalars['Int']['input']>;
  nftCount_lte?: InputMaybe<Scalars['Int']['input']>;
  nftCount_not_eq?: InputMaybe<Scalars['Int']['input']>;
  nftCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  nfts_every?: InputMaybe<NftEntityWhereInput>;
  nfts_none?: InputMaybe<NftEntityWhereInput>;
  nfts_some?: InputMaybe<NftEntityWhereInput>;
  ownerCount_eq?: InputMaybe<Scalars['Int']['input']>;
  ownerCount_gt?: InputMaybe<Scalars['Int']['input']>;
  ownerCount_gte?: InputMaybe<Scalars['Int']['input']>;
  ownerCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  ownerCount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  ownerCount_lt?: InputMaybe<Scalars['Int']['input']>;
  ownerCount_lte?: InputMaybe<Scalars['Int']['input']>;
  ownerCount_not_eq?: InputMaybe<Scalars['Int']['input']>;
  ownerCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  recipient_contains?: InputMaybe<Scalars['String']['input']>;
  recipient_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  recipient_endsWith?: InputMaybe<Scalars['String']['input']>;
  recipient_eq?: InputMaybe<Scalars['String']['input']>;
  recipient_gt?: InputMaybe<Scalars['String']['input']>;
  recipient_gte?: InputMaybe<Scalars['String']['input']>;
  recipient_in?: InputMaybe<Array<Scalars['String']['input']>>;
  recipient_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  recipient_lt?: InputMaybe<Scalars['String']['input']>;
  recipient_lte?: InputMaybe<Scalars['String']['input']>;
  recipient_not_contains?: InputMaybe<Scalars['String']['input']>;
  recipient_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  recipient_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  recipient_not_eq?: InputMaybe<Scalars['String']['input']>;
  recipient_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  recipient_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  recipient_startsWith?: InputMaybe<Scalars['String']['input']>;
  royalty_eq?: InputMaybe<Scalars['Float']['input']>;
  royalty_gt?: InputMaybe<Scalars['Float']['input']>;
  royalty_gte?: InputMaybe<Scalars['Float']['input']>;
  royalty_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  royalty_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  royalty_lt?: InputMaybe<Scalars['Float']['input']>;
  royalty_lte?: InputMaybe<Scalars['Float']['input']>;
  royalty_not_eq?: InputMaybe<Scalars['Float']['input']>;
  royalty_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  supply_eq?: InputMaybe<Scalars['Int']['input']>;
  supply_gt?: InputMaybe<Scalars['Int']['input']>;
  supply_gte?: InputMaybe<Scalars['Int']['input']>;
  supply_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  supply_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  supply_lt?: InputMaybe<Scalars['Int']['input']>;
  supply_lte?: InputMaybe<Scalars['Int']['input']>;
  supply_not_eq?: InputMaybe<Scalars['Int']['input']>;
  supply_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  updatedAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  updatedAt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  updatedAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  version_eq?: InputMaybe<Scalars['Int']['input']>;
  version_gt?: InputMaybe<Scalars['Int']['input']>;
  version_gte?: InputMaybe<Scalars['Int']['input']>;
  version_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  version_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  version_lt?: InputMaybe<Scalars['Int']['input']>;
  version_lte?: InputMaybe<Scalars['Int']['input']>;
  version_not_eq?: InputMaybe<Scalars['Int']['input']>;
  version_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  volume_eq?: InputMaybe<Scalars['BigInt']['input']>;
  volume_gt?: InputMaybe<Scalars['BigInt']['input']>;
  volume_gte?: InputMaybe<Scalars['BigInt']['input']>;
  volume_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  volume_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  volume_lt?: InputMaybe<Scalars['BigInt']['input']>;
  volume_lte?: InputMaybe<Scalars['BigInt']['input']>;
  volume_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  volume_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type CollectionEvent = EventType & {
  __typename?: 'CollectionEvent';
  blockNumber?: Maybe<Scalars['BigInt']['output']>;
  caller: Scalars['String']['output'];
  collection: CollectionEntity;
  currentOwner?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  interaction: Interaction;
  meta: Scalars['String']['output'];
  timestamp: Scalars['DateTime']['output'];
};

export type CollectionEventEdge = {
  __typename?: 'CollectionEventEdge';
  cursor: Scalars['String']['output'];
  node: CollectionEvent;
};

export enum CollectionEventOrderByInput {
  BlockNumberAsc = 'blockNumber_ASC',
  BlockNumberDesc = 'blockNumber_DESC',
  CallerAsc = 'caller_ASC',
  CallerDesc = 'caller_DESC',
  CollectionBlockNumberAsc = 'collection_blockNumber_ASC',
  CollectionBlockNumberDesc = 'collection_blockNumber_DESC',
  CollectionBurnedAsc = 'collection_burned_ASC',
  CollectionBurnedDesc = 'collection_burned_DESC',
  CollectionCreatedAtAsc = 'collection_createdAt_ASC',
  CollectionCreatedAtDesc = 'collection_createdAt_DESC',
  CollectionCurrentOwnerAsc = 'collection_currentOwner_ASC',
  CollectionCurrentOwnerDesc = 'collection_currentOwner_DESC',
  CollectionDistributionAsc = 'collection_distribution_ASC',
  CollectionDistributionDesc = 'collection_distribution_DESC',
  CollectionFloorAsc = 'collection_floor_ASC',
  CollectionFloorDesc = 'collection_floor_DESC',
  CollectionHashAsc = 'collection_hash_ASC',
  CollectionHashDesc = 'collection_hash_DESC',
  CollectionHighestSaleAsc = 'collection_highestSale_ASC',
  CollectionHighestSaleDesc = 'collection_highestSale_DESC',
  CollectionIdAsc = 'collection_id_ASC',
  CollectionIdDesc = 'collection_id_DESC',
  CollectionImageAsc = 'collection_image_ASC',
  CollectionImageDesc = 'collection_image_DESC',
  CollectionIssuerAsc = 'collection_issuer_ASC',
  CollectionIssuerDesc = 'collection_issuer_DESC',
  CollectionMaxAsc = 'collection_max_ASC',
  CollectionMaxDesc = 'collection_max_DESC',
  CollectionMediaAsc = 'collection_media_ASC',
  CollectionMediaDesc = 'collection_media_DESC',
  CollectionMetadataAsc = 'collection_metadata_ASC',
  CollectionMetadataDesc = 'collection_metadata_DESC',
  CollectionNameAsc = 'collection_name_ASC',
  CollectionNameDesc = 'collection_name_DESC',
  CollectionNftCountAsc = 'collection_nftCount_ASC',
  CollectionNftCountDesc = 'collection_nftCount_DESC',
  CollectionOwnerCountAsc = 'collection_ownerCount_ASC',
  CollectionOwnerCountDesc = 'collection_ownerCount_DESC',
  CollectionRecipientAsc = 'collection_recipient_ASC',
  CollectionRecipientDesc = 'collection_recipient_DESC',
  CollectionRoyaltyAsc = 'collection_royalty_ASC',
  CollectionRoyaltyDesc = 'collection_royalty_DESC',
  CollectionSupplyAsc = 'collection_supply_ASC',
  CollectionSupplyDesc = 'collection_supply_DESC',
  CollectionUpdatedAtAsc = 'collection_updatedAt_ASC',
  CollectionUpdatedAtDesc = 'collection_updatedAt_DESC',
  CollectionVersionAsc = 'collection_version_ASC',
  CollectionVersionDesc = 'collection_version_DESC',
  CollectionVolumeAsc = 'collection_volume_ASC',
  CollectionVolumeDesc = 'collection_volume_DESC',
  CurrentOwnerAsc = 'currentOwner_ASC',
  CurrentOwnerDesc = 'currentOwner_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  InteractionAsc = 'interaction_ASC',
  InteractionDesc = 'interaction_DESC',
  MetaAsc = 'meta_ASC',
  MetaDesc = 'meta_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC'
}

export type CollectionEventWhereInput = {
  AND?: InputMaybe<Array<CollectionEventWhereInput>>;
  OR?: InputMaybe<Array<CollectionEventWhereInput>>;
  blockNumber_eq?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  caller_contains?: InputMaybe<Scalars['String']['input']>;
  caller_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  caller_endsWith?: InputMaybe<Scalars['String']['input']>;
  caller_eq?: InputMaybe<Scalars['String']['input']>;
  caller_gt?: InputMaybe<Scalars['String']['input']>;
  caller_gte?: InputMaybe<Scalars['String']['input']>;
  caller_in?: InputMaybe<Array<Scalars['String']['input']>>;
  caller_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  caller_lt?: InputMaybe<Scalars['String']['input']>;
  caller_lte?: InputMaybe<Scalars['String']['input']>;
  caller_not_contains?: InputMaybe<Scalars['String']['input']>;
  caller_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  caller_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  caller_not_eq?: InputMaybe<Scalars['String']['input']>;
  caller_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  caller_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  caller_startsWith?: InputMaybe<Scalars['String']['input']>;
  collection?: InputMaybe<CollectionEntityWhereInput>;
  collection_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  currentOwner_contains?: InputMaybe<Scalars['String']['input']>;
  currentOwner_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  currentOwner_endsWith?: InputMaybe<Scalars['String']['input']>;
  currentOwner_eq?: InputMaybe<Scalars['String']['input']>;
  currentOwner_gt?: InputMaybe<Scalars['String']['input']>;
  currentOwner_gte?: InputMaybe<Scalars['String']['input']>;
  currentOwner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  currentOwner_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  currentOwner_lt?: InputMaybe<Scalars['String']['input']>;
  currentOwner_lte?: InputMaybe<Scalars['String']['input']>;
  currentOwner_not_contains?: InputMaybe<Scalars['String']['input']>;
  currentOwner_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  currentOwner_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  currentOwner_not_eq?: InputMaybe<Scalars['String']['input']>;
  currentOwner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  currentOwner_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  currentOwner_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  interaction_eq?: InputMaybe<Interaction>;
  interaction_in?: InputMaybe<Array<Interaction>>;
  interaction_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  interaction_not_eq?: InputMaybe<Interaction>;
  interaction_not_in?: InputMaybe<Array<Interaction>>;
  meta_contains?: InputMaybe<Scalars['String']['input']>;
  meta_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  meta_endsWith?: InputMaybe<Scalars['String']['input']>;
  meta_eq?: InputMaybe<Scalars['String']['input']>;
  meta_gt?: InputMaybe<Scalars['String']['input']>;
  meta_gte?: InputMaybe<Scalars['String']['input']>;
  meta_in?: InputMaybe<Array<Scalars['String']['input']>>;
  meta_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  meta_lt?: InputMaybe<Scalars['String']['input']>;
  meta_lte?: InputMaybe<Scalars['String']['input']>;
  meta_not_contains?: InputMaybe<Scalars['String']['input']>;
  meta_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  meta_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  meta_not_eq?: InputMaybe<Scalars['String']['input']>;
  meta_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  meta_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  meta_startsWith?: InputMaybe<Scalars['String']['input']>;
  timestamp_eq?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_gt?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_gte?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  timestamp_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  timestamp_lt?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_lte?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type CollectionEventsConnection = {
  __typename?: 'CollectionEventsConnection';
  edges: Array<CollectionEventEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type CountEntity = {
  __typename?: 'CountEntity';
  totalCount: Scalars['Float']['output'];
};

export type CountEntityQueryResult = {
  __typename?: 'CountEntityQueryResult';
  total_count: Scalars['Float']['output'];
};

export type Event = EventType & {
  __typename?: 'Event';
  blockNumber?: Maybe<Scalars['BigInt']['output']>;
  caller: Scalars['String']['output'];
  currentOwner: Scalars['String']['output'];
  id: Scalars['String']['output'];
  interaction: Interaction;
  meta: Scalars['String']['output'];
  nft: NftEntity;
  timestamp: Scalars['DateTime']['output'];
};

export type EventEdge = {
  __typename?: 'EventEdge';
  cursor: Scalars['String']['output'];
  node: Event;
};

export type EventEntity = {
  __typename?: 'EventEntity';
  count?: Maybe<Scalars['Float']['output']>;
  date: Scalars['DateTime']['output'];
  max?: Maybe<Scalars['BigInt']['output']>;
};

export enum EventOrderByInput {
  BlockNumberAsc = 'blockNumber_ASC',
  BlockNumberDesc = 'blockNumber_DESC',
  CallerAsc = 'caller_ASC',
  CallerDesc = 'caller_DESC',
  CurrentOwnerAsc = 'currentOwner_ASC',
  CurrentOwnerDesc = 'currentOwner_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  InteractionAsc = 'interaction_ASC',
  InteractionDesc = 'interaction_DESC',
  MetaAsc = 'meta_ASC',
  MetaDesc = 'meta_DESC',
  NftBlockNumberAsc = 'nft_blockNumber_ASC',
  NftBlockNumberDesc = 'nft_blockNumber_DESC',
  NftBurnedAsc = 'nft_burned_ASC',
  NftBurnedDesc = 'nft_burned_DESC',
  NftCreatedAtAsc = 'nft_createdAt_ASC',
  NftCreatedAtDesc = 'nft_createdAt_DESC',
  NftCurrentOwnerAsc = 'nft_currentOwner_ASC',
  NftCurrentOwnerDesc = 'nft_currentOwner_DESC',
  NftHashAsc = 'nft_hash_ASC',
  NftHashDesc = 'nft_hash_DESC',
  NftIdAsc = 'nft_id_ASC',
  NftIdDesc = 'nft_id_DESC',
  NftImageAsc = 'nft_image_ASC',
  NftImageDesc = 'nft_image_DESC',
  NftIssuerAsc = 'nft_issuer_ASC',
  NftIssuerDesc = 'nft_issuer_DESC',
  NftLewdAsc = 'nft_lewd_ASC',
  NftLewdDesc = 'nft_lewd_DESC',
  NftMediaAsc = 'nft_media_ASC',
  NftMediaDesc = 'nft_media_DESC',
  NftMetadataAsc = 'nft_metadata_ASC',
  NftMetadataDesc = 'nft_metadata_DESC',
  NftNameAsc = 'nft_name_ASC',
  NftNameDesc = 'nft_name_DESC',
  NftPriceAsc = 'nft_price_ASC',
  NftPriceDesc = 'nft_price_DESC',
  NftRecipientAsc = 'nft_recipient_ASC',
  NftRecipientDesc = 'nft_recipient_DESC',
  NftRoyaltyAsc = 'nft_royalty_ASC',
  NftRoyaltyDesc = 'nft_royalty_DESC',
  NftSnAsc = 'nft_sn_ASC',
  NftSnDesc = 'nft_sn_DESC',
  NftUpdatedAtAsc = 'nft_updatedAt_ASC',
  NftUpdatedAtDesc = 'nft_updatedAt_DESC',
  NftVersionAsc = 'nft_version_ASC',
  NftVersionDesc = 'nft_version_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC'
}

export type EventType = {
  blockNumber?: Maybe<Scalars['BigInt']['output']>;
  caller: Scalars['String']['output'];
  currentOwner?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  interaction: Interaction;
  meta: Scalars['String']['output'];
  timestamp: Scalars['DateTime']['output'];
};

export type EventWhereInput = {
  AND?: InputMaybe<Array<EventWhereInput>>;
  OR?: InputMaybe<Array<EventWhereInput>>;
  blockNumber_eq?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  caller_contains?: InputMaybe<Scalars['String']['input']>;
  caller_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  caller_endsWith?: InputMaybe<Scalars['String']['input']>;
  caller_eq?: InputMaybe<Scalars['String']['input']>;
  caller_gt?: InputMaybe<Scalars['String']['input']>;
  caller_gte?: InputMaybe<Scalars['String']['input']>;
  caller_in?: InputMaybe<Array<Scalars['String']['input']>>;
  caller_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  caller_lt?: InputMaybe<Scalars['String']['input']>;
  caller_lte?: InputMaybe<Scalars['String']['input']>;
  caller_not_contains?: InputMaybe<Scalars['String']['input']>;
  caller_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  caller_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  caller_not_eq?: InputMaybe<Scalars['String']['input']>;
  caller_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  caller_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  caller_startsWith?: InputMaybe<Scalars['String']['input']>;
  currentOwner_contains?: InputMaybe<Scalars['String']['input']>;
  currentOwner_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  currentOwner_endsWith?: InputMaybe<Scalars['String']['input']>;
  currentOwner_eq?: InputMaybe<Scalars['String']['input']>;
  currentOwner_gt?: InputMaybe<Scalars['String']['input']>;
  currentOwner_gte?: InputMaybe<Scalars['String']['input']>;
  currentOwner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  currentOwner_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  currentOwner_lt?: InputMaybe<Scalars['String']['input']>;
  currentOwner_lte?: InputMaybe<Scalars['String']['input']>;
  currentOwner_not_contains?: InputMaybe<Scalars['String']['input']>;
  currentOwner_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  currentOwner_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  currentOwner_not_eq?: InputMaybe<Scalars['String']['input']>;
  currentOwner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  currentOwner_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  currentOwner_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  interaction_eq?: InputMaybe<Interaction>;
  interaction_in?: InputMaybe<Array<Interaction>>;
  interaction_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  interaction_not_eq?: InputMaybe<Interaction>;
  interaction_not_in?: InputMaybe<Array<Interaction>>;
  meta_contains?: InputMaybe<Scalars['String']['input']>;
  meta_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  meta_endsWith?: InputMaybe<Scalars['String']['input']>;
  meta_eq?: InputMaybe<Scalars['String']['input']>;
  meta_gt?: InputMaybe<Scalars['String']['input']>;
  meta_gte?: InputMaybe<Scalars['String']['input']>;
  meta_in?: InputMaybe<Array<Scalars['String']['input']>>;
  meta_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  meta_lt?: InputMaybe<Scalars['String']['input']>;
  meta_lte?: InputMaybe<Scalars['String']['input']>;
  meta_not_contains?: InputMaybe<Scalars['String']['input']>;
  meta_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  meta_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  meta_not_eq?: InputMaybe<Scalars['String']['input']>;
  meta_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  meta_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  meta_startsWith?: InputMaybe<Scalars['String']['input']>;
  nft?: InputMaybe<NftEntityWhereInput>;
  nft_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  timestamp_eq?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_gt?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_gte?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  timestamp_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  timestamp_lt?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_lte?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type EventsConnection = {
  __typename?: 'EventsConnection';
  edges: Array<EventEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type HistoryEntity = {
  __typename?: 'HistoryEntity';
  count: Scalars['Float']['output'];
  date: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
};

export enum Interaction {
  Burn = 'BURN',
  Buy = 'BUY',
  Changeissuer = 'CHANGEISSUER',
  Create = 'CREATE',
  Destroy = 'DESTROY',
  List = 'LIST',
  Lock = 'LOCK',
  Mint = 'MINT',
  Send = 'SEND',
  Unlist = 'UNLIST'
}

export type LastEventEntity = {
  __typename?: 'LastEventEntity';
  animationUrl?: Maybe<Scalars['String']['output']>;
  collectionId: Scalars['String']['output'];
  collectionName?: Maybe<Scalars['String']['output']>;
  currentOwner: Scalars['String']['output'];
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  issuer: Scalars['String']['output'];
  metadata: Scalars['String']['output'];
  name: Scalars['String']['output'];
  timestamp: Scalars['DateTime']['output'];
  value: Scalars['String']['output'];
};

export type MetadataEntitiesConnection = {
  __typename?: 'MetadataEntitiesConnection';
  edges: Array<MetadataEntityEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type MetadataEntity = {
  __typename?: 'MetadataEntity';
  animationUrl?: Maybe<Scalars['String']['output']>;
  attributes?: Maybe<Array<Attribute>>;
  banner?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type MetadataEntityEdge = {
  __typename?: 'MetadataEntityEdge';
  cursor: Scalars['String']['output'];
  node: MetadataEntity;
};

export enum MetadataEntityOrderByInput {
  AnimationUrlAsc = 'animationUrl_ASC',
  AnimationUrlDesc = 'animationUrl_DESC',
  BannerAsc = 'banner_ASC',
  BannerDesc = 'banner_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  ImageAsc = 'image_ASC',
  ImageDesc = 'image_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC'
}

export type MetadataEntityWhereInput = {
  AND?: InputMaybe<Array<MetadataEntityWhereInput>>;
  OR?: InputMaybe<Array<MetadataEntityWhereInput>>;
  animationUrl_contains?: InputMaybe<Scalars['String']['input']>;
  animationUrl_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  animationUrl_endsWith?: InputMaybe<Scalars['String']['input']>;
  animationUrl_eq?: InputMaybe<Scalars['String']['input']>;
  animationUrl_gt?: InputMaybe<Scalars['String']['input']>;
  animationUrl_gte?: InputMaybe<Scalars['String']['input']>;
  animationUrl_in?: InputMaybe<Array<Scalars['String']['input']>>;
  animationUrl_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  animationUrl_lt?: InputMaybe<Scalars['String']['input']>;
  animationUrl_lte?: InputMaybe<Scalars['String']['input']>;
  animationUrl_not_contains?: InputMaybe<Scalars['String']['input']>;
  animationUrl_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  animationUrl_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  animationUrl_not_eq?: InputMaybe<Scalars['String']['input']>;
  animationUrl_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  animationUrl_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  animationUrl_startsWith?: InputMaybe<Scalars['String']['input']>;
  attributes_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  banner_contains?: InputMaybe<Scalars['String']['input']>;
  banner_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  banner_endsWith?: InputMaybe<Scalars['String']['input']>;
  banner_eq?: InputMaybe<Scalars['String']['input']>;
  banner_gt?: InputMaybe<Scalars['String']['input']>;
  banner_gte?: InputMaybe<Scalars['String']['input']>;
  banner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  banner_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  banner_lt?: InputMaybe<Scalars['String']['input']>;
  banner_lte?: InputMaybe<Scalars['String']['input']>;
  banner_not_contains?: InputMaybe<Scalars['String']['input']>;
  banner_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  banner_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  banner_not_eq?: InputMaybe<Scalars['String']['input']>;
  banner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  banner_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  banner_startsWith?: InputMaybe<Scalars['String']['input']>;
  description_contains?: InputMaybe<Scalars['String']['input']>;
  description_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  description_endsWith?: InputMaybe<Scalars['String']['input']>;
  description_eq?: InputMaybe<Scalars['String']['input']>;
  description_gt?: InputMaybe<Scalars['String']['input']>;
  description_gte?: InputMaybe<Scalars['String']['input']>;
  description_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  description_lt?: InputMaybe<Scalars['String']['input']>;
  description_lte?: InputMaybe<Scalars['String']['input']>;
  description_not_contains?: InputMaybe<Scalars['String']['input']>;
  description_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  description_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  description_not_eq?: InputMaybe<Scalars['String']['input']>;
  description_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  description_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  image_contains?: InputMaybe<Scalars['String']['input']>;
  image_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  image_endsWith?: InputMaybe<Scalars['String']['input']>;
  image_eq?: InputMaybe<Scalars['String']['input']>;
  image_gt?: InputMaybe<Scalars['String']['input']>;
  image_gte?: InputMaybe<Scalars['String']['input']>;
  image_in?: InputMaybe<Array<Scalars['String']['input']>>;
  image_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  image_lt?: InputMaybe<Scalars['String']['input']>;
  image_lte?: InputMaybe<Scalars['String']['input']>;
  image_not_contains?: InputMaybe<Scalars['String']['input']>;
  image_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  image_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  image_not_eq?: InputMaybe<Scalars['String']['input']>;
  image_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  image_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  image_startsWith?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  name_endsWith?: InputMaybe<Scalars['String']['input']>;
  name_eq?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  name_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  name_not_eq?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  name_startsWith?: InputMaybe<Scalars['String']['input']>;
  type_contains?: InputMaybe<Scalars['String']['input']>;
  type_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  type_endsWith?: InputMaybe<Scalars['String']['input']>;
  type_eq?: InputMaybe<Scalars['String']['input']>;
  type_gt?: InputMaybe<Scalars['String']['input']>;
  type_gte?: InputMaybe<Scalars['String']['input']>;
  type_in?: InputMaybe<Array<Scalars['String']['input']>>;
  type_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  type_lt?: InputMaybe<Scalars['String']['input']>;
  type_lte?: InputMaybe<Scalars['String']['input']>;
  type_not_contains?: InputMaybe<Scalars['String']['input']>;
  type_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  type_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  type_not_eq?: InputMaybe<Scalars['String']['input']>;
  type_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  type_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  type_startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type NftEntitiesConnection = {
  __typename?: 'NFTEntitiesConnection';
  edges: Array<NftEntityEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type NftEntity = {
  __typename?: 'NFTEntity';
  attributes?: Maybe<Array<Attribute>>;
  blockNumber?: Maybe<Scalars['BigInt']['output']>;
  burned: Scalars['Boolean']['output'];
  collection: CollectionEntity;
  createdAt: Scalars['DateTime']['output'];
  currentOwner: Scalars['String']['output'];
  events: Array<Event>;
  hash: Scalars['String']['output'];
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  issuer: Scalars['String']['output'];
  lewd: Scalars['Boolean']['output'];
  media?: Maybe<Scalars['String']['output']>;
  meta?: Maybe<MetadataEntity>;
  metadata?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['BigInt']['output']>;
  recipient?: Maybe<Scalars['String']['output']>;
  royalty?: Maybe<Scalars['Float']['output']>;
  sn: Scalars['String']['output'];
  token?: Maybe<TokenEntity>;
  updatedAt: Scalars['DateTime']['output'];
  version: Scalars['Int']['output'];
};


export type NftEntityEventsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EventOrderByInput>>;
  where?: InputMaybe<EventWhereInput>;
};

export type NftEntityEdge = {
  __typename?: 'NFTEntityEdge';
  cursor: Scalars['String']['output'];
  node: NftEntity;
};

export enum NftEntityOrderByInput {
  BlockNumberAsc = 'blockNumber_ASC',
  BlockNumberDesc = 'blockNumber_DESC',
  BurnedAsc = 'burned_ASC',
  BurnedDesc = 'burned_DESC',
  CollectionBlockNumberAsc = 'collection_blockNumber_ASC',
  CollectionBlockNumberDesc = 'collection_blockNumber_DESC',
  CollectionBurnedAsc = 'collection_burned_ASC',
  CollectionBurnedDesc = 'collection_burned_DESC',
  CollectionCreatedAtAsc = 'collection_createdAt_ASC',
  CollectionCreatedAtDesc = 'collection_createdAt_DESC',
  CollectionCurrentOwnerAsc = 'collection_currentOwner_ASC',
  CollectionCurrentOwnerDesc = 'collection_currentOwner_DESC',
  CollectionDistributionAsc = 'collection_distribution_ASC',
  CollectionDistributionDesc = 'collection_distribution_DESC',
  CollectionFloorAsc = 'collection_floor_ASC',
  CollectionFloorDesc = 'collection_floor_DESC',
  CollectionHashAsc = 'collection_hash_ASC',
  CollectionHashDesc = 'collection_hash_DESC',
  CollectionHighestSaleAsc = 'collection_highestSale_ASC',
  CollectionHighestSaleDesc = 'collection_highestSale_DESC',
  CollectionIdAsc = 'collection_id_ASC',
  CollectionIdDesc = 'collection_id_DESC',
  CollectionImageAsc = 'collection_image_ASC',
  CollectionImageDesc = 'collection_image_DESC',
  CollectionIssuerAsc = 'collection_issuer_ASC',
  CollectionIssuerDesc = 'collection_issuer_DESC',
  CollectionMaxAsc = 'collection_max_ASC',
  CollectionMaxDesc = 'collection_max_DESC',
  CollectionMediaAsc = 'collection_media_ASC',
  CollectionMediaDesc = 'collection_media_DESC',
  CollectionMetadataAsc = 'collection_metadata_ASC',
  CollectionMetadataDesc = 'collection_metadata_DESC',
  CollectionNameAsc = 'collection_name_ASC',
  CollectionNameDesc = 'collection_name_DESC',
  CollectionNftCountAsc = 'collection_nftCount_ASC',
  CollectionNftCountDesc = 'collection_nftCount_DESC',
  CollectionOwnerCountAsc = 'collection_ownerCount_ASC',
  CollectionOwnerCountDesc = 'collection_ownerCount_DESC',
  CollectionRecipientAsc = 'collection_recipient_ASC',
  CollectionRecipientDesc = 'collection_recipient_DESC',
  CollectionRoyaltyAsc = 'collection_royalty_ASC',
  CollectionRoyaltyDesc = 'collection_royalty_DESC',
  CollectionSupplyAsc = 'collection_supply_ASC',
  CollectionSupplyDesc = 'collection_supply_DESC',
  CollectionUpdatedAtAsc = 'collection_updatedAt_ASC',
  CollectionUpdatedAtDesc = 'collection_updatedAt_DESC',
  CollectionVersionAsc = 'collection_version_ASC',
  CollectionVersionDesc = 'collection_version_DESC',
  CollectionVolumeAsc = 'collection_volume_ASC',
  CollectionVolumeDesc = 'collection_volume_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  CurrentOwnerAsc = 'currentOwner_ASC',
  CurrentOwnerDesc = 'currentOwner_DESC',
  HashAsc = 'hash_ASC',
  HashDesc = 'hash_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  ImageAsc = 'image_ASC',
  ImageDesc = 'image_DESC',
  IssuerAsc = 'issuer_ASC',
  IssuerDesc = 'issuer_DESC',
  LewdAsc = 'lewd_ASC',
  LewdDesc = 'lewd_DESC',
  MediaAsc = 'media_ASC',
  MediaDesc = 'media_DESC',
  MetaAnimationUrlAsc = 'meta_animationUrl_ASC',
  MetaAnimationUrlDesc = 'meta_animationUrl_DESC',
  MetaBannerAsc = 'meta_banner_ASC',
  MetaBannerDesc = 'meta_banner_DESC',
  MetaDescriptionAsc = 'meta_description_ASC',
  MetaDescriptionDesc = 'meta_description_DESC',
  MetaIdAsc = 'meta_id_ASC',
  MetaIdDesc = 'meta_id_DESC',
  MetaImageAsc = 'meta_image_ASC',
  MetaImageDesc = 'meta_image_DESC',
  MetaNameAsc = 'meta_name_ASC',
  MetaNameDesc = 'meta_name_DESC',
  MetaTypeAsc = 'meta_type_ASC',
  MetaTypeDesc = 'meta_type_DESC',
  MetadataAsc = 'metadata_ASC',
  MetadataDesc = 'metadata_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  PriceAsc = 'price_ASC',
  PriceDesc = 'price_DESC',
  RecipientAsc = 'recipient_ASC',
  RecipientDesc = 'recipient_DESC',
  RoyaltyAsc = 'royalty_ASC',
  RoyaltyDesc = 'royalty_DESC',
  SnAsc = 'sn_ASC',
  SnDesc = 'sn_DESC',
  TokenBlockNumberAsc = 'token_blockNumber_ASC',
  TokenBlockNumberDesc = 'token_blockNumber_DESC',
  TokenCountAsc = 'token_count_ASC',
  TokenCountDesc = 'token_count_DESC',
  TokenCreatedAtAsc = 'token_createdAt_ASC',
  TokenCreatedAtDesc = 'token_createdAt_DESC',
  TokenHashAsc = 'token_hash_ASC',
  TokenHashDesc = 'token_hash_DESC',
  TokenIdAsc = 'token_id_ASC',
  TokenIdDesc = 'token_id_DESC',
  TokenImageAsc = 'token_image_ASC',
  TokenImageDesc = 'token_image_DESC',
  TokenMediaAsc = 'token_media_ASC',
  TokenMediaDesc = 'token_media_DESC',
  TokenMetadataAsc = 'token_metadata_ASC',
  TokenMetadataDesc = 'token_metadata_DESC',
  TokenNameAsc = 'token_name_ASC',
  TokenNameDesc = 'token_name_DESC',
  TokenSupplyAsc = 'token_supply_ASC',
  TokenSupplyDesc = 'token_supply_DESC',
  TokenUpdatedAtAsc = 'token_updatedAt_ASC',
  TokenUpdatedAtDesc = 'token_updatedAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
  VersionAsc = 'version_ASC',
  VersionDesc = 'version_DESC'
}

export type NftEntityWhereInput = {
  AND?: InputMaybe<Array<NftEntityWhereInput>>;
  OR?: InputMaybe<Array<NftEntityWhereInput>>;
  attributes_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  blockNumber_eq?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  burned_eq?: InputMaybe<Scalars['Boolean']['input']>;
  burned_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  burned_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  collection?: InputMaybe<CollectionEntityWhereInput>;
  collection_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  createdAt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  currentOwner_contains?: InputMaybe<Scalars['String']['input']>;
  currentOwner_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  currentOwner_endsWith?: InputMaybe<Scalars['String']['input']>;
  currentOwner_eq?: InputMaybe<Scalars['String']['input']>;
  currentOwner_gt?: InputMaybe<Scalars['String']['input']>;
  currentOwner_gte?: InputMaybe<Scalars['String']['input']>;
  currentOwner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  currentOwner_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  currentOwner_lt?: InputMaybe<Scalars['String']['input']>;
  currentOwner_lte?: InputMaybe<Scalars['String']['input']>;
  currentOwner_not_contains?: InputMaybe<Scalars['String']['input']>;
  currentOwner_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  currentOwner_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  currentOwner_not_eq?: InputMaybe<Scalars['String']['input']>;
  currentOwner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  currentOwner_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  currentOwner_startsWith?: InputMaybe<Scalars['String']['input']>;
  events_every?: InputMaybe<EventWhereInput>;
  events_none?: InputMaybe<EventWhereInput>;
  events_some?: InputMaybe<EventWhereInput>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  hash_endsWith?: InputMaybe<Scalars['String']['input']>;
  hash_eq?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  hash_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  hash_not_eq?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  hash_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  image_contains?: InputMaybe<Scalars['String']['input']>;
  image_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  image_endsWith?: InputMaybe<Scalars['String']['input']>;
  image_eq?: InputMaybe<Scalars['String']['input']>;
  image_gt?: InputMaybe<Scalars['String']['input']>;
  image_gte?: InputMaybe<Scalars['String']['input']>;
  image_in?: InputMaybe<Array<Scalars['String']['input']>>;
  image_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  image_lt?: InputMaybe<Scalars['String']['input']>;
  image_lte?: InputMaybe<Scalars['String']['input']>;
  image_not_contains?: InputMaybe<Scalars['String']['input']>;
  image_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  image_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  image_not_eq?: InputMaybe<Scalars['String']['input']>;
  image_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  image_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  image_startsWith?: InputMaybe<Scalars['String']['input']>;
  issuer_contains?: InputMaybe<Scalars['String']['input']>;
  issuer_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  issuer_endsWith?: InputMaybe<Scalars['String']['input']>;
  issuer_eq?: InputMaybe<Scalars['String']['input']>;
  issuer_gt?: InputMaybe<Scalars['String']['input']>;
  issuer_gte?: InputMaybe<Scalars['String']['input']>;
  issuer_in?: InputMaybe<Array<Scalars['String']['input']>>;
  issuer_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  issuer_lt?: InputMaybe<Scalars['String']['input']>;
  issuer_lte?: InputMaybe<Scalars['String']['input']>;
  issuer_not_contains?: InputMaybe<Scalars['String']['input']>;
  issuer_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  issuer_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  issuer_not_eq?: InputMaybe<Scalars['String']['input']>;
  issuer_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  issuer_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  issuer_startsWith?: InputMaybe<Scalars['String']['input']>;
  lewd_eq?: InputMaybe<Scalars['Boolean']['input']>;
  lewd_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lewd_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  media_contains?: InputMaybe<Scalars['String']['input']>;
  media_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  media_endsWith?: InputMaybe<Scalars['String']['input']>;
  media_eq?: InputMaybe<Scalars['String']['input']>;
  media_gt?: InputMaybe<Scalars['String']['input']>;
  media_gte?: InputMaybe<Scalars['String']['input']>;
  media_in?: InputMaybe<Array<Scalars['String']['input']>>;
  media_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  media_lt?: InputMaybe<Scalars['String']['input']>;
  media_lte?: InputMaybe<Scalars['String']['input']>;
  media_not_contains?: InputMaybe<Scalars['String']['input']>;
  media_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  media_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  media_not_eq?: InputMaybe<Scalars['String']['input']>;
  media_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  media_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  media_startsWith?: InputMaybe<Scalars['String']['input']>;
  meta?: InputMaybe<MetadataEntityWhereInput>;
  meta_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  metadata_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  metadata_endsWith?: InputMaybe<Scalars['String']['input']>;
  metadata_eq?: InputMaybe<Scalars['String']['input']>;
  metadata_gt?: InputMaybe<Scalars['String']['input']>;
  metadata_gte?: InputMaybe<Scalars['String']['input']>;
  metadata_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  metadata_lt?: InputMaybe<Scalars['String']['input']>;
  metadata_lte?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  metadata_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  metadata_not_eq?: InputMaybe<Scalars['String']['input']>;
  metadata_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  metadata_startsWith?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  name_endsWith?: InputMaybe<Scalars['String']['input']>;
  name_eq?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  name_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  name_not_eq?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  name_startsWith?: InputMaybe<Scalars['String']['input']>;
  price_eq?: InputMaybe<Scalars['BigInt']['input']>;
  price_gt?: InputMaybe<Scalars['BigInt']['input']>;
  price_gte?: InputMaybe<Scalars['BigInt']['input']>;
  price_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  price_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  price_lt?: InputMaybe<Scalars['BigInt']['input']>;
  price_lte?: InputMaybe<Scalars['BigInt']['input']>;
  price_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  price_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  recipient_contains?: InputMaybe<Scalars['String']['input']>;
  recipient_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  recipient_endsWith?: InputMaybe<Scalars['String']['input']>;
  recipient_eq?: InputMaybe<Scalars['String']['input']>;
  recipient_gt?: InputMaybe<Scalars['String']['input']>;
  recipient_gte?: InputMaybe<Scalars['String']['input']>;
  recipient_in?: InputMaybe<Array<Scalars['String']['input']>>;
  recipient_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  recipient_lt?: InputMaybe<Scalars['String']['input']>;
  recipient_lte?: InputMaybe<Scalars['String']['input']>;
  recipient_not_contains?: InputMaybe<Scalars['String']['input']>;
  recipient_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  recipient_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  recipient_not_eq?: InputMaybe<Scalars['String']['input']>;
  recipient_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  recipient_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  recipient_startsWith?: InputMaybe<Scalars['String']['input']>;
  royalty_eq?: InputMaybe<Scalars['Float']['input']>;
  royalty_gt?: InputMaybe<Scalars['Float']['input']>;
  royalty_gte?: InputMaybe<Scalars['Float']['input']>;
  royalty_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  royalty_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  royalty_lt?: InputMaybe<Scalars['Float']['input']>;
  royalty_lte?: InputMaybe<Scalars['Float']['input']>;
  royalty_not_eq?: InputMaybe<Scalars['Float']['input']>;
  royalty_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  sn_contains?: InputMaybe<Scalars['String']['input']>;
  sn_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  sn_endsWith?: InputMaybe<Scalars['String']['input']>;
  sn_eq?: InputMaybe<Scalars['String']['input']>;
  sn_gt?: InputMaybe<Scalars['String']['input']>;
  sn_gte?: InputMaybe<Scalars['String']['input']>;
  sn_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sn_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  sn_lt?: InputMaybe<Scalars['String']['input']>;
  sn_lte?: InputMaybe<Scalars['String']['input']>;
  sn_not_contains?: InputMaybe<Scalars['String']['input']>;
  sn_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  sn_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  sn_not_eq?: InputMaybe<Scalars['String']['input']>;
  sn_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sn_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  sn_startsWith?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<TokenEntityWhereInput>;
  token_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  updatedAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  updatedAt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  updatedAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  version_eq?: InputMaybe<Scalars['Int']['input']>;
  version_gt?: InputMaybe<Scalars['Int']['input']>;
  version_gte?: InputMaybe<Scalars['Int']['input']>;
  version_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  version_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  version_lt?: InputMaybe<Scalars['Int']['input']>;
  version_lte?: InputMaybe<Scalars['Int']['input']>;
  version_not_eq?: InputMaybe<Scalars['Int']['input']>;
  version_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor: Scalars['String']['output'];
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor: Scalars['String']['output'];
};

export type PartialMetadataEntity = {
  __typename?: 'PartialMetadataEntity';
  animationUrl?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  activeWallets: Array<CountEntity>;
  assetEntities: Array<AssetEntity>;
  assetEntitiesConnection: AssetEntitiesConnection;
  assetEntityById?: Maybe<AssetEntity>;
  /** @deprecated Use assetEntityById */
  assetEntityByUniqueInput?: Maybe<AssetEntity>;
  collectionBuyEventStatsById: Array<EventEntity>;
  collectionEntities: Array<CollectionEntity>;
  collectionEntitiesConnection: CollectionEntitiesConnection;
  collectionEntityById?: Maybe<CollectionEntity>;
  /** @deprecated Use collectionEntityById */
  collectionEntityByUniqueInput?: Maybe<CollectionEntity>;
  collectionEventById?: Maybe<CollectionEvent>;
  /** @deprecated Use collectionEventById */
  collectionEventByUniqueInput?: Maybe<CollectionEvent>;
  collectionEvents: Array<CollectionEvent>;
  collectionEventsConnection: CollectionEventsConnection;
  eventById?: Maybe<Event>;
  /** @deprecated Use eventById */
  eventByUniqueInput?: Maybe<Event>;
  events: Array<Event>;
  eventsConnection: EventsConnection;
  lastEvent: Array<LastEventEntity>;
  metadataEntities: Array<MetadataEntity>;
  metadataEntitiesConnection: MetadataEntitiesConnection;
  metadataEntityById?: Maybe<MetadataEntity>;
  /** @deprecated Use metadataEntityById */
  metadataEntityByUniqueInput?: Maybe<MetadataEntity>;
  nftEntities: Array<NftEntity>;
  nftEntitiesConnection: NftEntitiesConnection;
  nftEntityById?: Maybe<NftEntity>;
  /** @deprecated Use nftEntityById */
  nftEntityByUniqueInput?: Maybe<NftEntity>;
  seriesInsightBuyHistory: Array<LastEventEntity>;
  seriesInsightTable: Array<SeriesEntity>;
  spotlightTable: Array<SpotlightEntity>;
  squidStatus?: Maybe<SquidStatus>;
  tokenEntities: Array<TokenEntity>;
  tokenEntitiesConnection: TokenEntitiesConnection;
  tokenEntityById?: Maybe<TokenEntity>;
  /** @deprecated Use tokenEntityById */
  tokenEntityByUniqueInput?: Maybe<TokenEntity>;
  tokenEntityCount: CountEntity;
  tokenEntityList: Array<TokenEntityModel>;
};


export type QueryAssetEntitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AssetEntityOrderByInput>>;
  where?: InputMaybe<AssetEntityWhereInput>;
};


export type QueryAssetEntitiesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<AssetEntityOrderByInput>;
  where?: InputMaybe<AssetEntityWhereInput>;
};


export type QueryAssetEntityByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryAssetEntityByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryCollectionBuyEventStatsByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryCollectionEntitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CollectionEntityOrderByInput>>;
  where?: InputMaybe<CollectionEntityWhereInput>;
};


export type QueryCollectionEntitiesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<CollectionEntityOrderByInput>;
  where?: InputMaybe<CollectionEntityWhereInput>;
};


export type QueryCollectionEntityByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryCollectionEntityByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryCollectionEventByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryCollectionEventByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryCollectionEventsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CollectionEventOrderByInput>>;
  where?: InputMaybe<CollectionEventWhereInput>;
};


export type QueryCollectionEventsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<CollectionEventOrderByInput>;
  where?: InputMaybe<CollectionEventWhereInput>;
};


export type QueryEventByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryEventByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryEventsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EventOrderByInput>>;
  where?: InputMaybe<EventWhereInput>;
};


export type QueryEventsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<EventOrderByInput>;
  where?: InputMaybe<EventWhereInput>;
};


export type QueryLastEventArgs = {
  interaction?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryMetadataEntitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<MetadataEntityOrderByInput>>;
  where?: InputMaybe<MetadataEntityWhereInput>;
};


export type QueryMetadataEntitiesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<MetadataEntityOrderByInput>;
  where?: InputMaybe<MetadataEntityWhereInput>;
};


export type QueryMetadataEntityByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryMetadataEntityByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryNftEntitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<NftEntityOrderByInput>>;
  where?: InputMaybe<NftEntityWhereInput>;
};


export type QueryNftEntitiesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<NftEntityOrderByInput>;
  where?: InputMaybe<NftEntityWhereInput>;
};


export type QueryNftEntityByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryNftEntityByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QuerySeriesInsightBuyHistoryArgs = {
  dateRange?: Scalars['String']['input'];
  ids: Array<Scalars['String']['input']>;
};


export type QuerySeriesInsightTableArgs = {
  dateRange?: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Float']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySpotlightTableArgs = {
  limit?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTokenEntitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TokenEntityOrderByInput>>;
  where?: InputMaybe<TokenEntityWhereInput>;
};


export type QueryTokenEntitiesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<TokenEntityOrderByInput>;
  where?: InputMaybe<TokenEntityWhereInput>;
};


export type QueryTokenEntityByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryTokenEntityByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryTokenEntityCountArgs = {
  collections?: InputMaybe<Array<Scalars['String']['input']>>;
  denyList?: InputMaybe<Array<Scalars['String']['input']>>;
  issuer?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  owner?: InputMaybe<Scalars['String']['input']>;
  price_gt?: InputMaybe<Scalars['Float']['input']>;
  price_gte?: InputMaybe<Scalars['Float']['input']>;
  price_lte?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryTokenEntityListArgs = {
  collections?: InputMaybe<Array<Scalars['String']['input']>>;
  denyList?: InputMaybe<Array<Scalars['String']['input']>>;
  issuer?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Scalars['String']['input']>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  price_gt?: InputMaybe<Scalars['Float']['input']>;
  price_gte?: InputMaybe<Scalars['Float']['input']>;
  price_lte?: InputMaybe<Scalars['Float']['input']>;
};

export type SeriesEntity = {
  __typename?: 'SeriesEntity';
  averagePrice?: Maybe<Scalars['BigInt']['output']>;
  buys?: Maybe<Scalars['Float']['output']>;
  floorPrice?: Maybe<Scalars['BigInt']['output']>;
  highestSale?: Maybe<Scalars['BigInt']['output']>;
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  issuer: Scalars['String']['output'];
  metadata?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  sold: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
  unique: Scalars['Float']['output'];
  uniqueCollectors: Scalars['Float']['output'];
  volume?: Maybe<Scalars['BigInt']['output']>;
};

export type SpotlightEntity = {
  __typename?: 'SpotlightEntity';
  average?: Maybe<Scalars['BigInt']['output']>;
  collections: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  sold: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
  unique: Scalars['Float']['output'];
  uniqueCollectors: Scalars['Float']['output'];
  volume?: Maybe<Scalars['BigInt']['output']>;
};

export type SquidStatus = {
  __typename?: 'SquidStatus';
  /** The height of the processed part of the chain */
  height?: Maybe<Scalars['Int']['output']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  assetEntities: Array<AssetEntity>;
  assetEntityById?: Maybe<AssetEntity>;
  collectionEntities: Array<CollectionEntity>;
  collectionEntityById?: Maybe<CollectionEntity>;
  collectionEventById?: Maybe<CollectionEvent>;
  collectionEvents: Array<CollectionEvent>;
  eventById?: Maybe<Event>;
  events: Array<Event>;
  metadataEntities: Array<MetadataEntity>;
  metadataEntityById?: Maybe<MetadataEntity>;
  nftEntities: Array<NftEntity>;
  nftEntityById?: Maybe<NftEntity>;
  tokenEntities: Array<TokenEntity>;
  tokenEntityById?: Maybe<TokenEntity>;
};


export type SubscriptionAssetEntitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AssetEntityOrderByInput>>;
  where?: InputMaybe<AssetEntityWhereInput>;
};


export type SubscriptionAssetEntityByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionCollectionEntitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CollectionEntityOrderByInput>>;
  where?: InputMaybe<CollectionEntityWhereInput>;
};


export type SubscriptionCollectionEntityByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionCollectionEventByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionCollectionEventsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CollectionEventOrderByInput>>;
  where?: InputMaybe<CollectionEventWhereInput>;
};


export type SubscriptionEventByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionEventsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EventOrderByInput>>;
  where?: InputMaybe<EventWhereInput>;
};


export type SubscriptionMetadataEntitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<MetadataEntityOrderByInput>>;
  where?: InputMaybe<MetadataEntityWhereInput>;
};


export type SubscriptionMetadataEntityByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionNftEntitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<NftEntityOrderByInput>>;
  where?: InputMaybe<NftEntityWhereInput>;
};


export type SubscriptionNftEntityByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionTokenEntitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TokenEntityOrderByInput>>;
  where?: InputMaybe<TokenEntityWhereInput>;
};


export type SubscriptionTokenEntityByIdArgs = {
  id: Scalars['String']['input'];
};

export type TokenEntitiesConnection = {
  __typename?: 'TokenEntitiesConnection';
  edges: Array<TokenEntityEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type TokenEntity = {
  __typename?: 'TokenEntity';
  blockNumber?: Maybe<Scalars['BigInt']['output']>;
  collection?: Maybe<CollectionEntity>;
  count: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  hash: Scalars['String']['output'];
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  media?: Maybe<Scalars['String']['output']>;
  meta?: Maybe<MetadataEntity>;
  metadata?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  nfts: Array<NftEntity>;
  supply: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};


export type TokenEntityNftsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<NftEntityOrderByInput>>;
  where?: InputMaybe<NftEntityWhereInput>;
};

export type TokenEntityEdge = {
  __typename?: 'TokenEntityEdge';
  cursor: Scalars['String']['output'];
  node: TokenEntity;
};

export type TokenEntityModel = {
  __typename?: 'TokenEntityModel';
  blockNumber: Scalars['BigInt']['output'];
  cheapest: Cheapest;
  collection: Collection;
  count: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  media?: Maybe<Scalars['String']['output']>;
  meta?: Maybe<PartialMetadataEntity>;
  metadata?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  supply: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export enum TokenEntityOrderByInput {
  BlockNumberAsc = 'blockNumber_ASC',
  BlockNumberDesc = 'blockNumber_DESC',
  CollectionBlockNumberAsc = 'collection_blockNumber_ASC',
  CollectionBlockNumberDesc = 'collection_blockNumber_DESC',
  CollectionBurnedAsc = 'collection_burned_ASC',
  CollectionBurnedDesc = 'collection_burned_DESC',
  CollectionCreatedAtAsc = 'collection_createdAt_ASC',
  CollectionCreatedAtDesc = 'collection_createdAt_DESC',
  CollectionCurrentOwnerAsc = 'collection_currentOwner_ASC',
  CollectionCurrentOwnerDesc = 'collection_currentOwner_DESC',
  CollectionDistributionAsc = 'collection_distribution_ASC',
  CollectionDistributionDesc = 'collection_distribution_DESC',
  CollectionFloorAsc = 'collection_floor_ASC',
  CollectionFloorDesc = 'collection_floor_DESC',
  CollectionHashAsc = 'collection_hash_ASC',
  CollectionHashDesc = 'collection_hash_DESC',
  CollectionHighestSaleAsc = 'collection_highestSale_ASC',
  CollectionHighestSaleDesc = 'collection_highestSale_DESC',
  CollectionIdAsc = 'collection_id_ASC',
  CollectionIdDesc = 'collection_id_DESC',
  CollectionImageAsc = 'collection_image_ASC',
  CollectionImageDesc = 'collection_image_DESC',
  CollectionIssuerAsc = 'collection_issuer_ASC',
  CollectionIssuerDesc = 'collection_issuer_DESC',
  CollectionMaxAsc = 'collection_max_ASC',
  CollectionMaxDesc = 'collection_max_DESC',
  CollectionMediaAsc = 'collection_media_ASC',
  CollectionMediaDesc = 'collection_media_DESC',
  CollectionMetadataAsc = 'collection_metadata_ASC',
  CollectionMetadataDesc = 'collection_metadata_DESC',
  CollectionNameAsc = 'collection_name_ASC',
  CollectionNameDesc = 'collection_name_DESC',
  CollectionNftCountAsc = 'collection_nftCount_ASC',
  CollectionNftCountDesc = 'collection_nftCount_DESC',
  CollectionOwnerCountAsc = 'collection_ownerCount_ASC',
  CollectionOwnerCountDesc = 'collection_ownerCount_DESC',
  CollectionRecipientAsc = 'collection_recipient_ASC',
  CollectionRecipientDesc = 'collection_recipient_DESC',
  CollectionRoyaltyAsc = 'collection_royalty_ASC',
  CollectionRoyaltyDesc = 'collection_royalty_DESC',
  CollectionSupplyAsc = 'collection_supply_ASC',
  CollectionSupplyDesc = 'collection_supply_DESC',
  CollectionUpdatedAtAsc = 'collection_updatedAt_ASC',
  CollectionUpdatedAtDesc = 'collection_updatedAt_DESC',
  CollectionVersionAsc = 'collection_version_ASC',
  CollectionVersionDesc = 'collection_version_DESC',
  CollectionVolumeAsc = 'collection_volume_ASC',
  CollectionVolumeDesc = 'collection_volume_DESC',
  CountAsc = 'count_ASC',
  CountDesc = 'count_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  HashAsc = 'hash_ASC',
  HashDesc = 'hash_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  ImageAsc = 'image_ASC',
  ImageDesc = 'image_DESC',
  MediaAsc = 'media_ASC',
  MediaDesc = 'media_DESC',
  MetaAnimationUrlAsc = 'meta_animationUrl_ASC',
  MetaAnimationUrlDesc = 'meta_animationUrl_DESC',
  MetaBannerAsc = 'meta_banner_ASC',
  MetaBannerDesc = 'meta_banner_DESC',
  MetaDescriptionAsc = 'meta_description_ASC',
  MetaDescriptionDesc = 'meta_description_DESC',
  MetaIdAsc = 'meta_id_ASC',
  MetaIdDesc = 'meta_id_DESC',
  MetaImageAsc = 'meta_image_ASC',
  MetaImageDesc = 'meta_image_DESC',
  MetaNameAsc = 'meta_name_ASC',
  MetaNameDesc = 'meta_name_DESC',
  MetaTypeAsc = 'meta_type_ASC',
  MetaTypeDesc = 'meta_type_DESC',
  MetadataAsc = 'metadata_ASC',
  MetadataDesc = 'metadata_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  SupplyAsc = 'supply_ASC',
  SupplyDesc = 'supply_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC'
}

export type TokenEntityQueryResult = {
  __typename?: 'TokenEntityQueryResult';
  block_number: Scalars['BigInt']['output'];
  cheapest_current_owner?: Maybe<Scalars['String']['output']>;
  cheapest_id?: Maybe<Scalars['String']['output']>;
  cheapest_price?: Maybe<Scalars['BigInt']['output']>;
  collection_id: Scalars['String']['output'];
  collection_name: Scalars['String']['output'];
  count: Scalars['Float']['output'];
  created_at: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  media?: Maybe<Scalars['String']['output']>;
  meta_animation_url?: Maybe<Scalars['String']['output']>;
  meta_description?: Maybe<Scalars['String']['output']>;
  meta_id: Scalars['String']['output'];
  meta_image?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  supply: Scalars['Float']['output'];
  updated_at: Scalars['DateTime']['output'];
};

export type TokenEntityWhereInput = {
  AND?: InputMaybe<Array<TokenEntityWhereInput>>;
  OR?: InputMaybe<Array<TokenEntityWhereInput>>;
  blockNumber_eq?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  collection?: InputMaybe<CollectionEntityWhereInput>;
  collection_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  count_eq?: InputMaybe<Scalars['Int']['input']>;
  count_gt?: InputMaybe<Scalars['Int']['input']>;
  count_gte?: InputMaybe<Scalars['Int']['input']>;
  count_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  count_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  count_lt?: InputMaybe<Scalars['Int']['input']>;
  count_lte?: InputMaybe<Scalars['Int']['input']>;
  count_not_eq?: InputMaybe<Scalars['Int']['input']>;
  count_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  createdAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  createdAt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  hash_endsWith?: InputMaybe<Scalars['String']['input']>;
  hash_eq?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  hash_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  hash_not_eq?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  hash_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  image_contains?: InputMaybe<Scalars['String']['input']>;
  image_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  image_endsWith?: InputMaybe<Scalars['String']['input']>;
  image_eq?: InputMaybe<Scalars['String']['input']>;
  image_gt?: InputMaybe<Scalars['String']['input']>;
  image_gte?: InputMaybe<Scalars['String']['input']>;
  image_in?: InputMaybe<Array<Scalars['String']['input']>>;
  image_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  image_lt?: InputMaybe<Scalars['String']['input']>;
  image_lte?: InputMaybe<Scalars['String']['input']>;
  image_not_contains?: InputMaybe<Scalars['String']['input']>;
  image_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  image_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  image_not_eq?: InputMaybe<Scalars['String']['input']>;
  image_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  image_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  image_startsWith?: InputMaybe<Scalars['String']['input']>;
  media_contains?: InputMaybe<Scalars['String']['input']>;
  media_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  media_endsWith?: InputMaybe<Scalars['String']['input']>;
  media_eq?: InputMaybe<Scalars['String']['input']>;
  media_gt?: InputMaybe<Scalars['String']['input']>;
  media_gte?: InputMaybe<Scalars['String']['input']>;
  media_in?: InputMaybe<Array<Scalars['String']['input']>>;
  media_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  media_lt?: InputMaybe<Scalars['String']['input']>;
  media_lte?: InputMaybe<Scalars['String']['input']>;
  media_not_contains?: InputMaybe<Scalars['String']['input']>;
  media_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  media_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  media_not_eq?: InputMaybe<Scalars['String']['input']>;
  media_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  media_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  media_startsWith?: InputMaybe<Scalars['String']['input']>;
  meta?: InputMaybe<MetadataEntityWhereInput>;
  meta_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  metadata_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  metadata_endsWith?: InputMaybe<Scalars['String']['input']>;
  metadata_eq?: InputMaybe<Scalars['String']['input']>;
  metadata_gt?: InputMaybe<Scalars['String']['input']>;
  metadata_gte?: InputMaybe<Scalars['String']['input']>;
  metadata_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  metadata_lt?: InputMaybe<Scalars['String']['input']>;
  metadata_lte?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  metadata_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  metadata_not_eq?: InputMaybe<Scalars['String']['input']>;
  metadata_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  metadata_startsWith?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  name_endsWith?: InputMaybe<Scalars['String']['input']>;
  name_eq?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  name_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  name_not_eq?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  name_startsWith?: InputMaybe<Scalars['String']['input']>;
  nfts_every?: InputMaybe<NftEntityWhereInput>;
  nfts_none?: InputMaybe<NftEntityWhereInput>;
  nfts_some?: InputMaybe<NftEntityWhereInput>;
  supply_eq?: InputMaybe<Scalars['Int']['input']>;
  supply_gt?: InputMaybe<Scalars['Int']['input']>;
  supply_gte?: InputMaybe<Scalars['Int']['input']>;
  supply_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  supply_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  supply_lt?: InputMaybe<Scalars['Int']['input']>;
  supply_lte?: InputMaybe<Scalars['Int']['input']>;
  supply_not_eq?: InputMaybe<Scalars['Int']['input']>;
  supply_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  updatedAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  updatedAt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  updatedAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type WhereIdInput = {
  id: Scalars['String']['input'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;


/** Mapping of interface types */
export type ResolversInterfaceTypes<RefType extends Record<string, unknown>> = {
  EventType: ( CollectionEvent ) | ( Event );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AssetEntitiesConnection: ResolverTypeWrapper<AssetEntitiesConnection>;
  AssetEntity: ResolverTypeWrapper<AssetEntity>;
  AssetEntityEdge: ResolverTypeWrapper<AssetEntityEdge>;
  AssetEntityOrderByInput: AssetEntityOrderByInput;
  AssetEntityWhereInput: AssetEntityWhereInput;
  Attribute: ResolverTypeWrapper<Attribute>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']['output']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Cheapest: ResolverTypeWrapper<Cheapest>;
  Collection: ResolverTypeWrapper<Collection>;
  CollectionEntitiesConnection: ResolverTypeWrapper<CollectionEntitiesConnection>;
  CollectionEntity: ResolverTypeWrapper<CollectionEntity>;
  CollectionEntityEdge: ResolverTypeWrapper<CollectionEntityEdge>;
  CollectionEntityOrderByInput: CollectionEntityOrderByInput;
  CollectionEntityWhereInput: CollectionEntityWhereInput;
  CollectionEvent: ResolverTypeWrapper<CollectionEvent>;
  CollectionEventEdge: ResolverTypeWrapper<CollectionEventEdge>;
  CollectionEventOrderByInput: CollectionEventOrderByInput;
  CollectionEventWhereInput: CollectionEventWhereInput;
  CollectionEventsConnection: ResolverTypeWrapper<CollectionEventsConnection>;
  CountEntity: ResolverTypeWrapper<CountEntity>;
  CountEntityQueryResult: ResolverTypeWrapper<CountEntityQueryResult>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Event: ResolverTypeWrapper<Event>;
  EventEdge: ResolverTypeWrapper<EventEdge>;
  EventEntity: ResolverTypeWrapper<EventEntity>;
  EventOrderByInput: EventOrderByInput;
  EventType: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['EventType']>;
  EventWhereInput: EventWhereInput;
  EventsConnection: ResolverTypeWrapper<EventsConnection>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  HistoryEntity: ResolverTypeWrapper<HistoryEntity>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Interaction: Interaction;
  LastEventEntity: ResolverTypeWrapper<LastEventEntity>;
  MetadataEntitiesConnection: ResolverTypeWrapper<MetadataEntitiesConnection>;
  MetadataEntity: ResolverTypeWrapper<MetadataEntity>;
  MetadataEntityEdge: ResolverTypeWrapper<MetadataEntityEdge>;
  MetadataEntityOrderByInput: MetadataEntityOrderByInput;
  MetadataEntityWhereInput: MetadataEntityWhereInput;
  NFTEntitiesConnection: ResolverTypeWrapper<NftEntitiesConnection>;
  NFTEntity: ResolverTypeWrapper<NftEntity>;
  NFTEntityEdge: ResolverTypeWrapper<NftEntityEdge>;
  NFTEntityOrderByInput: NftEntityOrderByInput;
  NFTEntityWhereInput: NftEntityWhereInput;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PartialMetadataEntity: ResolverTypeWrapper<PartialMetadataEntity>;
  Query: ResolverTypeWrapper<{}>;
  SeriesEntity: ResolverTypeWrapper<SeriesEntity>;
  SpotlightEntity: ResolverTypeWrapper<SpotlightEntity>;
  SquidStatus: ResolverTypeWrapper<SquidStatus>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  TokenEntitiesConnection: ResolverTypeWrapper<TokenEntitiesConnection>;
  TokenEntity: ResolverTypeWrapper<TokenEntity>;
  TokenEntityEdge: ResolverTypeWrapper<TokenEntityEdge>;
  TokenEntityModel: ResolverTypeWrapper<TokenEntityModel>;
  TokenEntityOrderByInput: TokenEntityOrderByInput;
  TokenEntityQueryResult: ResolverTypeWrapper<TokenEntityQueryResult>;
  TokenEntityWhereInput: TokenEntityWhereInput;
  WhereIdInput: WhereIdInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AssetEntitiesConnection: AssetEntitiesConnection;
  AssetEntity: AssetEntity;
  AssetEntityEdge: AssetEntityEdge;
  AssetEntityWhereInput: AssetEntityWhereInput;
  Attribute: Attribute;
  BigInt: Scalars['BigInt']['output'];
  Boolean: Scalars['Boolean']['output'];
  Cheapest: Cheapest;
  Collection: Collection;
  CollectionEntitiesConnection: CollectionEntitiesConnection;
  CollectionEntity: CollectionEntity;
  CollectionEntityEdge: CollectionEntityEdge;
  CollectionEntityWhereInput: CollectionEntityWhereInput;
  CollectionEvent: CollectionEvent;
  CollectionEventEdge: CollectionEventEdge;
  CollectionEventWhereInput: CollectionEventWhereInput;
  CollectionEventsConnection: CollectionEventsConnection;
  CountEntity: CountEntity;
  CountEntityQueryResult: CountEntityQueryResult;
  DateTime: Scalars['DateTime']['output'];
  Event: Event;
  EventEdge: EventEdge;
  EventEntity: EventEntity;
  EventType: ResolversInterfaceTypes<ResolversParentTypes>['EventType'];
  EventWhereInput: EventWhereInput;
  EventsConnection: EventsConnection;
  Float: Scalars['Float']['output'];
  HistoryEntity: HistoryEntity;
  Int: Scalars['Int']['output'];
  LastEventEntity: LastEventEntity;
  MetadataEntitiesConnection: MetadataEntitiesConnection;
  MetadataEntity: MetadataEntity;
  MetadataEntityEdge: MetadataEntityEdge;
  MetadataEntityWhereInput: MetadataEntityWhereInput;
  NFTEntitiesConnection: NftEntitiesConnection;
  NFTEntity: NftEntity;
  NFTEntityEdge: NftEntityEdge;
  NFTEntityWhereInput: NftEntityWhereInput;
  PageInfo: PageInfo;
  PartialMetadataEntity: PartialMetadataEntity;
  Query: {};
  SeriesEntity: SeriesEntity;
  SpotlightEntity: SpotlightEntity;
  SquidStatus: SquidStatus;
  String: Scalars['String']['output'];
  Subscription: {};
  TokenEntitiesConnection: TokenEntitiesConnection;
  TokenEntity: TokenEntity;
  TokenEntityEdge: TokenEntityEdge;
  TokenEntityModel: TokenEntityModel;
  TokenEntityQueryResult: TokenEntityQueryResult;
  TokenEntityWhereInput: TokenEntityWhereInput;
  WhereIdInput: WhereIdInput;
};

export type AssetEntitiesConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AssetEntitiesConnection'] = ResolversParentTypes['AssetEntitiesConnection']> = {
  edges?: Resolver<Array<ResolversTypes['AssetEntityEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AssetEntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['AssetEntity'] = ResolversParentTypes['AssetEntity']> = {
  decimals?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  symbol?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AssetEntityEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AssetEntityEdge'] = ResolversParentTypes['AssetEntityEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['AssetEntity'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AttributeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Attribute'] = ResolversParentTypes['Attribute']> = {
  display?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  trait?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export type CheapestResolvers<ContextType = any, ParentType extends ResolversParentTypes['Cheapest'] = ResolversParentTypes['Cheapest']> = {
  currentOwner?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  price?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CollectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Collection'] = ResolversParentTypes['Collection']> = {
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CollectionEntitiesConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['CollectionEntitiesConnection'] = ResolversParentTypes['CollectionEntitiesConnection']> = {
  edges?: Resolver<Array<ResolversTypes['CollectionEntityEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CollectionEntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['CollectionEntity'] = ResolversParentTypes['CollectionEntity']> = {
  attributes?: Resolver<Maybe<Array<ResolversTypes['Attribute']>>, ParentType, ContextType>;
  blockNumber?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  burned?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  currentOwner?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  distribution?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  events?: Resolver<Array<ResolversTypes['CollectionEvent']>, ParentType, ContextType, Partial<CollectionEntityEventsArgs>>;
  floor?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  highestSale?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  issuer?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  max?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  media?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  meta?: Resolver<Maybe<ResolversTypes['MetadataEntity']>, ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nftCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  nfts?: Resolver<Array<ResolversTypes['NFTEntity']>, ParentType, ContextType, Partial<CollectionEntityNftsArgs>>;
  ownerCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  recipient?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  royalty?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  supply?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  volume?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CollectionEntityEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['CollectionEntityEdge'] = ResolversParentTypes['CollectionEntityEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['CollectionEntity'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CollectionEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['CollectionEvent'] = ResolversParentTypes['CollectionEvent']> = {
  blockNumber?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  caller?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  collection?: Resolver<ResolversTypes['CollectionEntity'], ParentType, ContextType>;
  currentOwner?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  interaction?: Resolver<ResolversTypes['Interaction'], ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CollectionEventEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['CollectionEventEdge'] = ResolversParentTypes['CollectionEventEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['CollectionEvent'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CollectionEventsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['CollectionEventsConnection'] = ResolversParentTypes['CollectionEventsConnection']> = {
  edges?: Resolver<Array<ResolversTypes['CollectionEventEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CountEntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['CountEntity'] = ResolversParentTypes['CountEntity']> = {
  totalCount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CountEntityQueryResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CountEntityQueryResult'] = ResolversParentTypes['CountEntityQueryResult']> = {
  total_count?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type EventResolvers<ContextType = any, ParentType extends ResolversParentTypes['Event'] = ResolversParentTypes['Event']> = {
  blockNumber?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  caller?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentOwner?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  interaction?: Resolver<ResolversTypes['Interaction'], ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nft?: Resolver<ResolversTypes['NFTEntity'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EventEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['EventEdge'] = ResolversParentTypes['EventEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Event'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EventEntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['EventEntity'] = ResolversParentTypes['EventEntity']> = {
  count?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  max?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EventTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['EventType'] = ResolversParentTypes['EventType']> = {
  __resolveType: TypeResolveFn<'CollectionEvent' | 'Event', ParentType, ContextType>;
  blockNumber?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  caller?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentOwner?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  interaction?: Resolver<ResolversTypes['Interaction'], ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type EventsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['EventsConnection'] = ResolversParentTypes['EventsConnection']> = {
  edges?: Resolver<Array<ResolversTypes['EventEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HistoryEntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['HistoryEntity'] = ResolversParentTypes['HistoryEntity']> = {
  count?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LastEventEntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['LastEventEntity'] = ResolversParentTypes['LastEventEntity']> = {
  animationUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  collectionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  collectionName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  currentOwner?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  issuer?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  metadata?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MetadataEntitiesConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['MetadataEntitiesConnection'] = ResolversParentTypes['MetadataEntitiesConnection']> = {
  edges?: Resolver<Array<ResolversTypes['MetadataEntityEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MetadataEntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['MetadataEntity'] = ResolversParentTypes['MetadataEntity']> = {
  animationUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  attributes?: Resolver<Maybe<Array<ResolversTypes['Attribute']>>, ParentType, ContextType>;
  banner?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MetadataEntityEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['MetadataEntityEdge'] = ResolversParentTypes['MetadataEntityEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['MetadataEntity'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftEntitiesConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['NFTEntitiesConnection'] = ResolversParentTypes['NFTEntitiesConnection']> = {
  edges?: Resolver<Array<ResolversTypes['NFTEntityEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftEntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['NFTEntity'] = ResolversParentTypes['NFTEntity']> = {
  attributes?: Resolver<Maybe<Array<ResolversTypes['Attribute']>>, ParentType, ContextType>;
  blockNumber?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  burned?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  collection?: Resolver<ResolversTypes['CollectionEntity'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  currentOwner?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  events?: Resolver<Array<ResolversTypes['Event']>, ParentType, ContextType, Partial<NftEntityEventsArgs>>;
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  issuer?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lewd?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  media?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  meta?: Resolver<Maybe<ResolversTypes['MetadataEntity']>, ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  price?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  recipient?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  royalty?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  sn?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['TokenEntity']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftEntityEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['NFTEntityEdge'] = ResolversParentTypes['NFTEntityEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['NFTEntity'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  endCursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PartialMetadataEntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['PartialMetadataEntity'] = ResolversParentTypes['PartialMetadataEntity']> = {
  animationUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  activeWallets?: Resolver<Array<ResolversTypes['CountEntity']>, ParentType, ContextType>;
  assetEntities?: Resolver<Array<ResolversTypes['AssetEntity']>, ParentType, ContextType, Partial<QueryAssetEntitiesArgs>>;
  assetEntitiesConnection?: Resolver<ResolversTypes['AssetEntitiesConnection'], ParentType, ContextType, RequireFields<QueryAssetEntitiesConnectionArgs, 'orderBy'>>;
  assetEntityById?: Resolver<Maybe<ResolversTypes['AssetEntity']>, ParentType, ContextType, RequireFields<QueryAssetEntityByIdArgs, 'id'>>;
  assetEntityByUniqueInput?: Resolver<Maybe<ResolversTypes['AssetEntity']>, ParentType, ContextType, RequireFields<QueryAssetEntityByUniqueInputArgs, 'where'>>;
  collectionBuyEventStatsById?: Resolver<Array<ResolversTypes['EventEntity']>, ParentType, ContextType, RequireFields<QueryCollectionBuyEventStatsByIdArgs, 'id'>>;
  collectionEntities?: Resolver<Array<ResolversTypes['CollectionEntity']>, ParentType, ContextType, Partial<QueryCollectionEntitiesArgs>>;
  collectionEntitiesConnection?: Resolver<ResolversTypes['CollectionEntitiesConnection'], ParentType, ContextType, RequireFields<QueryCollectionEntitiesConnectionArgs, 'orderBy'>>;
  collectionEntityById?: Resolver<Maybe<ResolversTypes['CollectionEntity']>, ParentType, ContextType, RequireFields<QueryCollectionEntityByIdArgs, 'id'>>;
  collectionEntityByUniqueInput?: Resolver<Maybe<ResolversTypes['CollectionEntity']>, ParentType, ContextType, RequireFields<QueryCollectionEntityByUniqueInputArgs, 'where'>>;
  collectionEventById?: Resolver<Maybe<ResolversTypes['CollectionEvent']>, ParentType, ContextType, RequireFields<QueryCollectionEventByIdArgs, 'id'>>;
  collectionEventByUniqueInput?: Resolver<Maybe<ResolversTypes['CollectionEvent']>, ParentType, ContextType, RequireFields<QueryCollectionEventByUniqueInputArgs, 'where'>>;
  collectionEvents?: Resolver<Array<ResolversTypes['CollectionEvent']>, ParentType, ContextType, Partial<QueryCollectionEventsArgs>>;
  collectionEventsConnection?: Resolver<ResolversTypes['CollectionEventsConnection'], ParentType, ContextType, RequireFields<QueryCollectionEventsConnectionArgs, 'orderBy'>>;
  eventById?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType, RequireFields<QueryEventByIdArgs, 'id'>>;
  eventByUniqueInput?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType, RequireFields<QueryEventByUniqueInputArgs, 'where'>>;
  events?: Resolver<Array<ResolversTypes['Event']>, ParentType, ContextType, Partial<QueryEventsArgs>>;
  eventsConnection?: Resolver<ResolversTypes['EventsConnection'], ParentType, ContextType, RequireFields<QueryEventsConnectionArgs, 'orderBy'>>;
  lastEvent?: Resolver<Array<ResolversTypes['LastEventEntity']>, ParentType, ContextType, RequireFields<QueryLastEventArgs, 'interaction' | 'limit' | 'offset'>>;
  metadataEntities?: Resolver<Array<ResolversTypes['MetadataEntity']>, ParentType, ContextType, Partial<QueryMetadataEntitiesArgs>>;
  metadataEntitiesConnection?: Resolver<ResolversTypes['MetadataEntitiesConnection'], ParentType, ContextType, RequireFields<QueryMetadataEntitiesConnectionArgs, 'orderBy'>>;
  metadataEntityById?: Resolver<Maybe<ResolversTypes['MetadataEntity']>, ParentType, ContextType, RequireFields<QueryMetadataEntityByIdArgs, 'id'>>;
  metadataEntityByUniqueInput?: Resolver<Maybe<ResolversTypes['MetadataEntity']>, ParentType, ContextType, RequireFields<QueryMetadataEntityByUniqueInputArgs, 'where'>>;
  nftEntities?: Resolver<Array<ResolversTypes['NFTEntity']>, ParentType, ContextType, Partial<QueryNftEntitiesArgs>>;
  nftEntitiesConnection?: Resolver<ResolversTypes['NFTEntitiesConnection'], ParentType, ContextType, RequireFields<QueryNftEntitiesConnectionArgs, 'orderBy'>>;
  nftEntityById?: Resolver<Maybe<ResolversTypes['NFTEntity']>, ParentType, ContextType, RequireFields<QueryNftEntityByIdArgs, 'id'>>;
  nftEntityByUniqueInput?: Resolver<Maybe<ResolversTypes['NFTEntity']>, ParentType, ContextType, RequireFields<QueryNftEntityByUniqueInputArgs, 'where'>>;
  seriesInsightBuyHistory?: Resolver<Array<ResolversTypes['LastEventEntity']>, ParentType, ContextType, RequireFields<QuerySeriesInsightBuyHistoryArgs, 'dateRange' | 'ids'>>;
  seriesInsightTable?: Resolver<Array<ResolversTypes['SeriesEntity']>, ParentType, ContextType, RequireFields<QuerySeriesInsightTableArgs, 'dateRange' | 'limit' | 'offset' | 'orderBy' | 'orderDirection'>>;
  spotlightTable?: Resolver<Array<ResolversTypes['SpotlightEntity']>, ParentType, ContextType, RequireFields<QuerySpotlightTableArgs, 'limit' | 'offset' | 'orderBy' | 'orderDirection'>>;
  squidStatus?: Resolver<Maybe<ResolversTypes['SquidStatus']>, ParentType, ContextType>;
  tokenEntities?: Resolver<Array<ResolversTypes['TokenEntity']>, ParentType, ContextType, Partial<QueryTokenEntitiesArgs>>;
  tokenEntitiesConnection?: Resolver<ResolversTypes['TokenEntitiesConnection'], ParentType, ContextType, RequireFields<QueryTokenEntitiesConnectionArgs, 'orderBy'>>;
  tokenEntityById?: Resolver<Maybe<ResolversTypes['TokenEntity']>, ParentType, ContextType, RequireFields<QueryTokenEntityByIdArgs, 'id'>>;
  tokenEntityByUniqueInput?: Resolver<Maybe<ResolversTypes['TokenEntity']>, ParentType, ContextType, RequireFields<QueryTokenEntityByUniqueInputArgs, 'where'>>;
  tokenEntityCount?: Resolver<ResolversTypes['CountEntity'], ParentType, ContextType, Partial<QueryTokenEntityCountArgs>>;
  tokenEntityList?: Resolver<Array<ResolversTypes['TokenEntityModel']>, ParentType, ContextType, RequireFields<QueryTokenEntityListArgs, 'limit' | 'offset' | 'orderBy'>>;
};

export type SeriesEntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['SeriesEntity'] = ResolversParentTypes['SeriesEntity']> = {
  averagePrice?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  buys?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  floorPrice?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  highestSale?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  issuer?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sold?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unique?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  uniqueCollectors?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  volume?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SpotlightEntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['SpotlightEntity'] = ResolversParentTypes['SpotlightEntity']> = {
  average?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  collections?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sold?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unique?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  uniqueCollectors?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  volume?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SquidStatusResolvers<ContextType = any, ParentType extends ResolversParentTypes['SquidStatus'] = ResolversParentTypes['SquidStatus']> = {
  height?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  assetEntities?: SubscriptionResolver<Array<ResolversTypes['AssetEntity']>, "assetEntities", ParentType, ContextType, Partial<SubscriptionAssetEntitiesArgs>>;
  assetEntityById?: SubscriptionResolver<Maybe<ResolversTypes['AssetEntity']>, "assetEntityById", ParentType, ContextType, RequireFields<SubscriptionAssetEntityByIdArgs, 'id'>>;
  collectionEntities?: SubscriptionResolver<Array<ResolversTypes['CollectionEntity']>, "collectionEntities", ParentType, ContextType, Partial<SubscriptionCollectionEntitiesArgs>>;
  collectionEntityById?: SubscriptionResolver<Maybe<ResolversTypes['CollectionEntity']>, "collectionEntityById", ParentType, ContextType, RequireFields<SubscriptionCollectionEntityByIdArgs, 'id'>>;
  collectionEventById?: SubscriptionResolver<Maybe<ResolversTypes['CollectionEvent']>, "collectionEventById", ParentType, ContextType, RequireFields<SubscriptionCollectionEventByIdArgs, 'id'>>;
  collectionEvents?: SubscriptionResolver<Array<ResolversTypes['CollectionEvent']>, "collectionEvents", ParentType, ContextType, Partial<SubscriptionCollectionEventsArgs>>;
  eventById?: SubscriptionResolver<Maybe<ResolversTypes['Event']>, "eventById", ParentType, ContextType, RequireFields<SubscriptionEventByIdArgs, 'id'>>;
  events?: SubscriptionResolver<Array<ResolversTypes['Event']>, "events", ParentType, ContextType, Partial<SubscriptionEventsArgs>>;
  metadataEntities?: SubscriptionResolver<Array<ResolversTypes['MetadataEntity']>, "metadataEntities", ParentType, ContextType, Partial<SubscriptionMetadataEntitiesArgs>>;
  metadataEntityById?: SubscriptionResolver<Maybe<ResolversTypes['MetadataEntity']>, "metadataEntityById", ParentType, ContextType, RequireFields<SubscriptionMetadataEntityByIdArgs, 'id'>>;
  nftEntities?: SubscriptionResolver<Array<ResolversTypes['NFTEntity']>, "nftEntities", ParentType, ContextType, Partial<SubscriptionNftEntitiesArgs>>;
  nftEntityById?: SubscriptionResolver<Maybe<ResolversTypes['NFTEntity']>, "nftEntityById", ParentType, ContextType, RequireFields<SubscriptionNftEntityByIdArgs, 'id'>>;
  tokenEntities?: SubscriptionResolver<Array<ResolversTypes['TokenEntity']>, "tokenEntities", ParentType, ContextType, Partial<SubscriptionTokenEntitiesArgs>>;
  tokenEntityById?: SubscriptionResolver<Maybe<ResolversTypes['TokenEntity']>, "tokenEntityById", ParentType, ContextType, RequireFields<SubscriptionTokenEntityByIdArgs, 'id'>>;
};

export type TokenEntitiesConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenEntitiesConnection'] = ResolversParentTypes['TokenEntitiesConnection']> = {
  edges?: Resolver<Array<ResolversTypes['TokenEntityEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TokenEntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenEntity'] = ResolversParentTypes['TokenEntity']> = {
  blockNumber?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  collection?: Resolver<Maybe<ResolversTypes['CollectionEntity']>, ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  media?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  meta?: Resolver<Maybe<ResolversTypes['MetadataEntity']>, ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nfts?: Resolver<Array<ResolversTypes['NFTEntity']>, ParentType, ContextType, Partial<TokenEntityNftsArgs>>;
  supply?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TokenEntityEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenEntityEdge'] = ResolversParentTypes['TokenEntityEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['TokenEntity'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TokenEntityModelResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenEntityModel'] = ResolversParentTypes['TokenEntityModel']> = {
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  cheapest?: Resolver<ResolversTypes['Cheapest'], ParentType, ContextType>;
  collection?: Resolver<ResolversTypes['Collection'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  media?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  meta?: Resolver<Maybe<ResolversTypes['PartialMetadataEntity']>, ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  supply?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TokenEntityQueryResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenEntityQueryResult'] = ResolversParentTypes['TokenEntityQueryResult']> = {
  block_number?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  cheapest_current_owner?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cheapest_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cheapest_price?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  collection_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  collection_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  media?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  meta_animation_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  meta_description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  meta_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  meta_image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  supply?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AssetEntitiesConnection?: AssetEntitiesConnectionResolvers<ContextType>;
  AssetEntity?: AssetEntityResolvers<ContextType>;
  AssetEntityEdge?: AssetEntityEdgeResolvers<ContextType>;
  Attribute?: AttributeResolvers<ContextType>;
  BigInt?: GraphQLScalarType;
  Cheapest?: CheapestResolvers<ContextType>;
  Collection?: CollectionResolvers<ContextType>;
  CollectionEntitiesConnection?: CollectionEntitiesConnectionResolvers<ContextType>;
  CollectionEntity?: CollectionEntityResolvers<ContextType>;
  CollectionEntityEdge?: CollectionEntityEdgeResolvers<ContextType>;
  CollectionEvent?: CollectionEventResolvers<ContextType>;
  CollectionEventEdge?: CollectionEventEdgeResolvers<ContextType>;
  CollectionEventsConnection?: CollectionEventsConnectionResolvers<ContextType>;
  CountEntity?: CountEntityResolvers<ContextType>;
  CountEntityQueryResult?: CountEntityQueryResultResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Event?: EventResolvers<ContextType>;
  EventEdge?: EventEdgeResolvers<ContextType>;
  EventEntity?: EventEntityResolvers<ContextType>;
  EventType?: EventTypeResolvers<ContextType>;
  EventsConnection?: EventsConnectionResolvers<ContextType>;
  HistoryEntity?: HistoryEntityResolvers<ContextType>;
  LastEventEntity?: LastEventEntityResolvers<ContextType>;
  MetadataEntitiesConnection?: MetadataEntitiesConnectionResolvers<ContextType>;
  MetadataEntity?: MetadataEntityResolvers<ContextType>;
  MetadataEntityEdge?: MetadataEntityEdgeResolvers<ContextType>;
  NFTEntitiesConnection?: NftEntitiesConnectionResolvers<ContextType>;
  NFTEntity?: NftEntityResolvers<ContextType>;
  NFTEntityEdge?: NftEntityEdgeResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  PartialMetadataEntity?: PartialMetadataEntityResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SeriesEntity?: SeriesEntityResolvers<ContextType>;
  SpotlightEntity?: SpotlightEntityResolvers<ContextType>;
  SquidStatus?: SquidStatusResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  TokenEntitiesConnection?: TokenEntitiesConnectionResolvers<ContextType>;
  TokenEntity?: TokenEntityResolvers<ContextType>;
  TokenEntityEdge?: TokenEntityEdgeResolvers<ContextType>;
  TokenEntityModel?: TokenEntityModelResolvers<ContextType>;
  TokenEntityQueryResult?: TokenEntityQueryResultResolvers<ContextType>;
};

