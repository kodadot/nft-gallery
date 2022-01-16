export type Optional<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigInt: bigint;
  DateTime: Date;
};

export type RemarkEntity = {
  __typename?: 'RemarkEntity';
  id: Scalars['ID'];
  value: Scalars['String'];
  caller: Scalars['String'];
  blockNumber: Scalars['String'];
  interaction?: Optional<Scalars['String']>;
};

export type FailedEntity = {
  __typename?: 'FailedEntity';
  id: Scalars['ID'];
  value: Scalars['String'];
  reason: Scalars['String'];
  interaction?: Optional<Scalars['String']>;
};

export type CollectionEntity = {
  __typename?: 'CollectionEntity';
  version?: Optional<Scalars['String']>;
  name?: Optional<Scalars['String']>;
  max: Scalars['Int'];
  issuer?: Optional<Scalars['String']>;
  symbol?: Optional<Scalars['String']>;
  id: Scalars['ID'];
  metadata?: Optional<Scalars['String']>;
  currentOwner?: Optional<Scalars['String']>;
  nfts?: Optional<Array<NftEntity>>;
  events?: Optional<Array<CollectionEvent>>;
  blockNumber?: Optional<Scalars['BigInt']>;
  meta?: Optional<MetadataEntity>;
  createdAt: Scalars['DateTime'];
};

export type NftEntity = {
  __typename?: 'NFTEntity';
  name?: Optional<Scalars['String']>;
  instance?: Optional<Scalars['String']>;
  transferable?: Optional<Scalars['Int']>;
  collection: CollectionEntity;
  issuer?: Optional<Scalars['String']>;
  sn?: Optional<Scalars['String']>;
  id: Scalars['ID'];
  metadata?: Optional<Scalars['String']>;
  currentOwner?: Optional<Scalars['String']>;
  price: Scalars['BigInt'];
  burned: Scalars['Boolean'];
  blockNumber?: Optional<Scalars['BigInt']>;
  events?: Optional<Array<Event>>;
  emotes?: Optional<Array<Emote>>;
  meta?: Optional<MetadataEntity>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type MetadataEntity = {
  __typename?: 'MetadataEntity';
  id: Scalars['ID'];
  name?: Optional<Scalars['String']>;
  description?: Optional<Scalars['String']>;
  image?: Optional<Scalars['String']>;
  attributes?: Optional<Array<Attribute>>;
  animationUrl?: Optional<Scalars['String']>;
  type?: Optional<Scalars['String']>;
};

export type Attribute = {
  __typename?: 'Attribute';
  display?: Optional<Scalars['String']>;
  trait?: Optional<Scalars['String']>;
  value: Scalars['String'];
};

export type EventType = {
  id: Scalars['ID'];
  blockNumber?: Optional<Scalars['BigInt']>;
  timestamp: Scalars['DateTime'];
  caller: Scalars['String'];
  interaction: Interaction;
  meta: Scalars['String'];
};

export type Event = EventType & {
  __typename?: 'Event';
  id: Scalars['ID'];
  blockNumber?: Optional<Scalars['BigInt']>;
  timestamp: Scalars['DateTime'];
  caller: Scalars['String'];
  interaction: Interaction;
  meta: Scalars['String'];
  nft: NftEntity;
};

export type CollectionEvent = {
  __typename?: 'CollectionEvent';
  blockNumber?: Optional<Scalars['String']>;
  timestamp?: Optional<Scalars['DateTime']>;
  caller: Scalars['String'];
  interaction: Scalars['String'];
  meta: Scalars['String'];
};

export type Emote = {
  __typename?: 'Emote';
  id: Scalars['ID'];
  nft: NftEntity;
  caller: Scalars['String'];
  value: Scalars['String'];
};

export enum Interaction {
  Mint = 'MINT',
  Mintnft = 'MINTNFT',
  List = 'LIST',
  Buy = 'BUY',
  Send = 'SEND',
  Consume = 'CONSUME',
  Changeissuer = 'CHANGEISSUER',
  Emote = 'EMOTE',
}
