import M, { Query } from 'mingo'
import { NFTWithMeta } from '../../service/scheme'

type QueryType = Record<string, unknown>

export const basicFilterQuery = (value: string): Query => {
  const rr: RegExp = new RegExp(value, 'i')
  const criteria: QueryType = {
    $or: [
      { name: { $regex: rr} },
      { instance: { $regex: rr} },
      { currentOwner: { $regex: rr} },
    ]


  }

  return new Query(criteria)
}

export const basicFilter = (value: string, ntfs: NFTWithMeta[]): any[] => {
  const query = basicFilterQuery(value)
  return query.find(ntfs).all()
}


