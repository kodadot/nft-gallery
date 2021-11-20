import ApolloClient from 'apollo-boost'

const apolloClient = new ApolloClient({
  name: 'rmrk',
  uri: 'https://gql.rmrk.app/v1/graphql'
})

export default apolloClient
