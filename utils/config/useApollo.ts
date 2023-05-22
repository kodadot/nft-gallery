import { DocumentNode } from 'graphql'
import type { ApolloClientMethods } from 'vue-apollo/types/vue-apollo'
import type { OperationVariables } from 'apollo-client/core/types'

export async function useApollo<T>(
  $apollo: ApolloClientMethods,
  client: string,
  query: DocumentNode,
  variables?: OperationVariables
): Promise<T> {
  const { data } = await $apollo.query<T>({ query, variables, client })
  return data
}
