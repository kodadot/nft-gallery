import { graphql } from '../../clients/graphqlClients'

export const collectionMetaFragment = graphql(`
  fragment collectionMeta on NFTEntity {
    collection {
      metadata
    }
  }
`)
