import { graphql } from '../../clients/graphqlClients'

const query = `query profileTabsCount($id: String!, $interactionIn: [Interaction!], $denyList: [String!]) {

  owned: nftEntitiesConnection(
    where: {
      currentOwner_eq: $id,
      burned_eq: false,
      metadata_not_eq: ""
      issuer_not_in: $denyList
     }
    orderBy: name_ASC
  ) {
    totalCount
  }

  created: nftEntitiesConnection(
    where: {
      issuer_eq: $id,
      burned_eq: false
      metadata_not_eq: ""
    }
    orderBy: blockNumber_DESC
  ) {
    totalCount
  }

  events: eventsConnection(
    where: {
      AND: [
        {
          caller_eq: $id,
          OR: {
            currentOwner_eq: $id,
          }
        },
      ],
      interaction_in: $interactionIn
    }
    orderBy: blockNumber_DESC
  ) {
    totalCount
  }

  collections: collectionEntitiesConnection(
    where: {
      nfts_some: { burned_eq: false }
      issuer_eq: $id
      issuer_not_in: $denyList
      metadata_isNull: false
    }
    orderBy: blockNumber_DESC
  ) {
    totalCount
  }

}`

const profileTabsCount = graphql(query)

export default profileTabsCount
