import { DocumentNode } from 'graphql'
import { DollarApollo } from 'vue-apollo/types/vue-apollo'

export function useApollo<A, T = any>(
  $apollo: DollarApollo<A>,
  client: string,
  query: DocumentNode,
  variables?: any
): Promise<T> {
  return $apollo.query<T>({ query, variables, client }).then(({ data }) => data)
}
