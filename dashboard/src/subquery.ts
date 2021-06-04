import ApolloClient from 'apollo-boost'

const apolloClient = new ApolloClient({
  // You should use an absolute URL here
  uri: process.env.VUE_APP_SUBQUERY_URL
})

export default apolloClient
