import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { INDEXERS as GRAPHQL_ENDPOINTS, type Prefix } from '@kodadot1/static'

export default defineNuxtPlugin(() => {
  const customUri = new HttpLink({
    uri: ({ getContext }) => {
      const { endpoint } = getContext()
      return GRAPHQL_ENDPOINTS[endpoint as Prefix]
    },
  })

  const client = new ApolloClient({
    link: customUri,
    cache: new InMemoryCache(),
  })

  return {
    provide: {
      apolloClient: client,
    },
  }
})
