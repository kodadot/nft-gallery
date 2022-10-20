import { SomethingWithMeta } from '~/components/rmrk/utils'
import { NFTWithCollectionMeta } from '~/components/unique/graphqlResponseTypes'
import { fromDecimals, toDecimals } from './math'

export const mapOnlyMetadata = (item: SomethingWithMeta): string =>
  item.metadata
export const mapNFTorCollectionMetadata = ({
  metadata,
  collection,
}: NFTWithCollectionMeta): string => metadata || collection?.metadata

// DEV: to -> value * 10 ** decimals ; from -> value / 10 ** decimals
export function mapDecimals(decimals: number, to = true): (number) => number {
  return to
    ? (value) => toDecimals(value, decimals)
    : (value) => fromDecimals(value, decimals)
}

export const logError = (
  error: Error | any,
  cb: (message: string) => void
): void => {
  if (error instanceof Error) {
    cb(error.message)
  }
}

export function mapToId(value: { id: string }): string {
  return value.id
}
