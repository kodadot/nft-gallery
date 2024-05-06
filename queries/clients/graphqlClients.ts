import { initGraphQLTada } from 'gql.tada'
import type { introspection as rmrkSchema } from './types/rmrk'
import type { introspection as ksmScehma } from './types/ksm'
import type { introspection as ahpSchema } from './types/ahp'
import type { introspection as ahkSchema } from './types/ahk'

export const graphqlRmrk = initGraphQLTada<{
  introspection: rmrkSchema
}>()

export const graphqlKsm = initGraphQLTada<{
  introspection: ksmScehma
}>()

export const graphqlAhp = initGraphQLTada<{
  introspection: ahpSchema
}>()

export const graphqlAhk = initGraphQLTada<{
  introspection: ahkSchema
}>()
export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada'
export { readFragment } from 'gql.tada'
