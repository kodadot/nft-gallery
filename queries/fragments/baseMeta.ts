import { graphql } from '../clients/subsquid-graphql'

export const baseMetaFragment = graphql(`
  fragment baseMeta on MetadataEntity {
    id
    image
    animationUrl
    name
    description
  }
`)
