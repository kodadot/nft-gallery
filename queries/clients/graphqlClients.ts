import { initGraphQLTada } from 'gql.tada'

import type { introspection as ahpSchema } from './ahp'

const graphqlAhp = initGraphQLTada<{
  introspection: ahpSchema
  scalars: {
    DateTime: string
    BigInt: string
  }
}>()

export const graphql = graphqlAhp // default client  for general queries
export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada'
export { readFragment } from 'gql.tada'
