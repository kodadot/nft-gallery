import { Row } from '@/components/spotlight/types'
import { RowRanking } from '@/components/Rankings/types'
import M, { Query, Aggregator } from 'mingo'
import { Collection as Aggregation } from 'mingo/core'
import { NFTWithMeta } from '../../service/scheme'
import { SortBy, QueryType, SearchQuery } from './types'

export const basicFilterQuery = (value: string): Query => {
  const rr = new RegExp(value, 'i')
  const criteria: QueryType = basicCriteria(rr)

  return new Query(criteria)
}

const basicCriteria = (rr: RegExp, additionalQuery: never[] = []) => ({
  $and: [
    ...additionalQuery
  ],
  $or: [
    { name: { $regex: rr} },
    { instance: { $regex: rr} },
    { currentOwner: { $regex: rr} },
    { description: { $regex: rr} },
    { collection: { $regex: rr} },
  ]
})

const queryOf = (criteria: QueryType) => new Query(criteria)

export const basicAggregation = (): Aggregator => {
  const agg: Aggregation = [
    {
      $match: {
        burned: { $ne: true }
      }
    },
    {
      $group: {
        _id: { image: '$image', collection: '$collection' },
        // _id: '$image',
        ids: { $push: '$id' },
        collectionId: { $first: '$collectionId' },
        name: { $first: '$name' },
        id: { $first: '$id' },
        image: { $first: '$image' },
        metadata: { $first: '$metadata' },
        price: { $first: '$price' },
        type: { $first: '$type' },
        burned: { $first: '$burned' },
        emoteCount: { $first: '$emoteCount' },
        count: { $sum: 1 }
      }
    }
  ]

  return new Aggregator(agg)
}

export const spotlightAggregation = (): Aggregator => {
  const agg: Aggregation = [
    {
      $group: {
        // _id: { image: '$id' },
        _id: '$id',
        id: { $first: '$id' },
        unique: { $sum: '$unique' },
        sold: { $sum: '$sold' },
        total: { $sum: '$total' },
        averagePrice: { $avg: '$averagePrice' },
        count: { $sum: '$count' },
        // collectors: { $setUnion: '$collectors' }, // TODO: Do not know how
        rank: { $sum: '$rank' }
      }
    },
    {
      $sort: { rank: -1 }
    }
  ]

  return new Aggregator(agg)
}

export const rankingsAggregation = (limit = 10): Aggregator => {
  const agg: Aggregation = [
    {
      $group: {
        // _id: { image: '$id' },
        _id: '$id',
        id: { $first: '$id' },
        unique: { $sum: '$unique' },
        sold: { $sum: '$sold' },
        total: { $sum: '$total' },
        averagePrice: { $avg: '$averagePrice' },
        floorPrice: { $sum: '$floorPrice' },
        count: { $sum: '$count' },
        // owned: { $sum: '$currentOwner' },
        rank: { $sum: '$rank' },
        volume: { $sum: '$volume' },
        weeklyVolume: { $sum: '$weeklyVolume' },
        monthlyVolume: { $sum: '$monthlyVolume' },
        name: { $first: '$name' },
        metadata: { $first: '$metadata' },
      }
    },
    {
      $sort: { rank: -1 },
    },
    {
      $limit: limit
    }
  ]

  return new Aggregator(agg)
}

export const basicFilter = (value: string, nfts: NFTWithMeta[]): any[] => {
  const query = basicFilterQuery(value)
  return query.find(nfts).all()
}

export const expandedFilter = (value: SearchQuery, nfts: NFTWithMeta[]): any[] => {
  // if (sort) {
  //   return query.find(nfts).sort(sort).all()
  // }
  const rr = new RegExp(value.search, 'i')
  const additionalQuery = value.type ? [{ type: { $regex: new RegExp(value.type, 'i')} }] as any : []
  const criteria: QueryType = basicCriteria(rr, additionalQuery)

  let cursor = queryOf(criteria).find(nfts)

  if (value.sortBy) {
    cursor = cursor.sort(value.sortBy)
  }

  return cursor.all()
}

export const basicAggQuery = (nfts: NFTWithMeta[]) => {
  const query = basicAggregation()
  return query.run(nfts)
}


export const spotlightAggQuery = (nfts: Row[]) => {
  const query = spotlightAggregation()
  return query.run(nfts)
}

export const rankingsAggQuery = (limit: number, nfts: RowRanking[]) => {
  const query = rankingsAggregation(limit)
  return query.run(nfts)
}


// dev sort({ age: 1 })
