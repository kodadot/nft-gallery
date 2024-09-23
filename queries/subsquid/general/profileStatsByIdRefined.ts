import { graphql } from '@/queries/clients/graphqlClients'
import { eventFragment } from '@/queries/fragments/typed/event'
import { nftFragment } from '@/queries/fragments/typed/nft'

const profileStatsByIdRefined = graphql(
  `
    query profileStatsByIdRefined($id: String!, $denyList: [String!]) {
      listed: nftEntities(
        where: {
          currentOwner_containsInsensitive: $id
          issuer_not_in: $denyList
          burned_eq: false
        }
      ) {
        events(
          where: { interaction_eq: LIST, caller_eq: $id }
          limit: 1
          orderBy: blockNumber_DESC
        ) {
          id
          meta
        }
      }

      obtained: nftEntitiesConnection(
        where: {
          currentOwner_containsInsensitive: $id
          burned_eq: false
          metadata_not_eq: ""
          issuer_not_in: $denyList
        }
        orderBy: name_ASC
      ) {
        totalCount
      }

      sold: events(
        where: { interaction_eq: BUY, currentOwner_containsInsensitive: $id, caller_not_eq: $id }
      ) {
        id
        meta
      }

      invested: events(
        where: {
          caller_containsInsensitive: $id
          interaction_eq: BUY
          nft: { burned_eq: false }
        }
      ) {
        ...event
        nft {
          ...nft
        }
      }
    }
  `,
  [nftFragment, eventFragment],
)

export default profileStatsByIdRefined
