import { SomethingWithMeta } from '~/components/rmrk/utils'
import { NFTWithCollectionMeta } from '~/components/unique/graphqlResponseTypes'

export const mapOnlyMetadata = (item: SomethingWithMeta): string => item.metadata
export const mapNFTorCollectionMetadata = ({ metadata, collection }: NFTWithCollectionMeta): string => metadata || collection.metadata

export const logError = (error: Error | any, cb: (message: string) => void): void => {
  if (error instanceof Error) {
    cb(error.message)
  }
}
