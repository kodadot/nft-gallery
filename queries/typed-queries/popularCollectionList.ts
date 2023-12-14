import { gql } from '@/__generated__/gql'

export const popularCollectionList = gql(/* GraphQL */ `
  query popularCollectionList(
    $limit: Float
    $orderBy: String
    $dateRange: String
    $orderDirection: String
  ) {
    seriesInsightTable(
      limit: $limit
      orderBy: $orderBy
      orderDirection: $orderDirection
      dateRange: $dateRange
    ) {
      id
      image
      metadata
      sold
      name
      issuer
      total
      buys
    }
  }
`)
