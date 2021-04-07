import M, { Query, Aggregator } from 'mingo'
import { Collection as Aggregation } from 'mingo/core'
import { NFTWithMeta } from '../../service/scheme'
import { SortBy, QueryType } from './types'

export const basicFilterQuery = (value: string, additionalQuery: any = {}): Query => {
  const rr: RegExp = new RegExp(value, 'i')
  const criteria: QueryType = {
    $or: [
      { name: { $regex: rr} },
      { instance: { $regex: rr} },
      { currentOwner: { $regex: rr} },
      { description: { $regex: rr} },
      { collection: { $regex: rr} },
      ...additionalQuery,
    ]


  }

  return new Query(criteria)
}

export const basicAggregation = (): Aggregator => {
  const agg: Aggregation = [
    {
      $group: {
        _id: { image: '$image', collection: '$collection' },
        // _id: '$image',
        ids: { $push: '$id' },
        collection: { $first: '$collection' },
        name: { $first: '$name' },
        id: { $first: '$id' },
        image: { $first: '$image' },
        count: { $sum: 1 }
      }
    }
  ]

  return new Aggregator(agg);
}

export const basicFilter = (value: string, nfts: NFTWithMeta[], sort?: SortBy): any[] => {
  const query = basicFilterQuery(value)
  if (sort) {
    return query.find(nfts).sort(sort).all()
  }

  return query.find(nfts).all()
}


export const basicAggQuery = (nfts: NFTWithMeta[]) => {
  const query = basicAggregation()
  return query.run(nfts)
}



// dev sort({ age: 1 })
