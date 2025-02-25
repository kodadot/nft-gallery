import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

export default defineNuxtPlugin(() => {
  const GRAPHQL_ENDPOINTS = {
    ahp: URLS.koda.speck,
    ahk: URLS.koda.stick,
  }

  const customUri = new HttpLink({
    uri: ({ getContext }) => {
      const { endpoint } = getContext()
      if (endpoint === 'ahk') {
        return GRAPHQL_ENDPOINTS.ahk
      }
      return GRAPHQL_ENDPOINTS.ahp
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
