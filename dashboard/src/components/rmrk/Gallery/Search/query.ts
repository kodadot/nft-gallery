import M, { Query, Aggregator } from 'mingo'
import { Collection as Aggregation } from 'mingo/core'
import { NFTWithMeta } from '../../service/scheme'


type QueryType = Record<string, unknown>

export const basicFilterQuery = (value: string): Query => {
  const rr: RegExp = new RegExp(value, 'i')
  const criteria: QueryType = {
    $or: [
      { name: { $regex: rr} },
      { instance: { $regex: rr} },
      { currentOwner: { $regex: rr} },
      { description: { $regex: rr} },
      { collection: { $regex: rr} },
    ]


  }

  return new Query(criteria)
}

export const basicAggregation = (): Aggregator => {
  const agg: Aggregation = [
    {
      $group: {
         _id: "$image",
         ids: { $push: "$id" },
         collection: { $first: "$collection" },
         name: { $first: "$name" },
         id: { $first: "$id" },
         image: { $first: "$image" },
         count: { $sum: 1 }
      }
    }

  ]

  return new Aggregator(agg)
}

export const basicFilter = (value: string, ntfs: NFTWithMeta[]): any[] => {
  const query = basicFilterQuery(value)
  return query.find(ntfs).all()
}


export const basicAggQuery = (ntfs: NFTWithMeta[]) => {
  const query = basicAggregation()
  return query.run(ntfs)
}

