import { initGraphQLTada } from 'gql.tada'
import type { introspection as rmrkSchema } from './types/rmrk'
import type { introspection as ksmScehma } from './types/ksm'
import type { introspection as ahpSchema } from './types/ahp'
import type { introspection as ahkSchema } from './types/ahk'

export const graphqlRmrk = initGraphQLTada<{
  introspection: rmrkSchema
  scalars: {
    DateTime: string
  }
}>()

export const graphqlKsm = initGraphQLTada<{
  introspection: ksmScehma
  scalars: {
    DateTime: string
  }
}>()

export const graphqlAhp = initGraphQLTada<{
  introspection: ahpSchema
  scalars: {
    DateTime: string
  }
}>()

export const graphqlAhk = initGraphQLTada<{
  introspection: ahkSchema
  scalars: {
    DateTime: string
  }
}>()

export const graphql = graphqlAhp // default client  for general queries
export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada'
export { readFragment } from 'gql.tada'
