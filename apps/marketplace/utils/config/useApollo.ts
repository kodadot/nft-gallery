import { DocumentNode } from 'graphql'
import type { DollarApollo } from 'vue-apollo/types/vue-apollo'
import type { ApolloClient } from 'apollo-client'

export function useApollo<A, T = any>(
  $apollo: DollarApollo<A> | ApolloClient<A>,
  client: string,
  query: DocumentNode,
  variables?: any
): Promise<T> {
  return $apollo.query<T>({ query, variables, client }).then(({ data }) => data)
}
