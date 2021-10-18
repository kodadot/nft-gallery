import { Row } from '@/components/spotlight/types'
import { RowSeries, SortType } from '@/components/series/types'
import { Query, Aggregator } from 'mingo'
import { Collection as Aggregation } from 'mingo/core'
import { NFTWithMeta } from '../../service/scheme'
import { QueryType, SearchQuery } from './types'

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
        rank: { $sum: '$rank' },
        volume: { $sum: '$volume' }
      }
    },
    {
      $sort: { rank: -1 }
    }
  ]

  return new Aggregator(agg)
}

export const seriesAggregation = (limit = 10, sort: SortType): Aggregator => {
  const agg: Aggregation = [
    {
      $group: {
        // _id: { image: '$id' },
        _id: '$id',
        id: { $first: '$id' },
        unique: { $sum: '$unique' },
        uniqueCollectors: { $sum: '$uniqueCollectors' },
        sold: { $sum: '$sold' },
        total: { $sum: '$total' },
        averagePrice: { $avg: '$averagePrice' },
        floorPrice: { $sum: '$floorPrice' },
        count: { $sum: '$count' },
        rank: { $sum: '$rank' },
        volume: { $sum: '$volume' },
        dailyVolume: { $sum: '$dailyVolume' },
        weeklyVolume: { $sum: '$weeklyVolume' },
        monthlyVolume: { $sum: '$monthlyVolume' },
        dailyrangeVolume: { $sum: '$dailyrangeVolume' },
        weeklyrangeVolume: { $sum: '$weeklyrangeVolume' },
        monthlyrangeVolume: { $sum: '$monthlyrangeVolume' },
        name: { $first: '$name' },
        metadata: { $first: '$metadata' }
      }
    },
    {
      $sort: { [sort['field']]: sort['value'] }
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

  const cursor = queryOf(criteria).find(nfts)

  // if (value.sortBy) {
  //   cursor = cursor.sort(value.sortBy)
  // }

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

export const seriesAggQuery = (limit: number, sort: SortType, nfts: RowSeries[]) => {
  const query = seriesAggregation(limit, sort)
  return query.run(nfts)
}


// dev sort({ age: 1 })
