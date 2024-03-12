import { getRandomIntFromRange } from '@/components/collection/unlockable/utils'
import { blake2AsHex, encodeAddress } from '@polkadot/util-crypto'

export type EntropyRange = [number, number]

export type GenerativePreviewItem = {
  hash: string
  image: string
  entropyRange: EntropyRange
}

export default () => {
  const { accountId } = useAuth()
  const { drop } = storeToRefs(useDropStore())

  const getHash = (randomSs58Format: number) => {
    const ss58Format = isValidSs58Format(randomSs58Format)
      ? randomSs58Format
      : 0

    // https://github.com/paritytech/ss58-registry/blob/30889d6c9d332953a6e3333b30513eef89003f64/ss58-registry.json#L1292C17-L1292C22
    const initialValue = accountId.value
      ? encodeAddress(accountId.value, ss58Format)
      : String(Date.now() << ss58Format)
    return blake2AsHex(initialValue, 256, null, true)
  }

  const generateHash = (range: EntropyRange) =>
    getHash(getRandomIntFromRange(...range))

  const generatePreviewItem = (
    entropyRange: [number, number],
  ): GenerativePreviewItem => {
    const hash = generateHash(entropyRange)
    const image = `${drop.value.content}/?hash=${hash}`
    return { hash, image, entropyRange }
  }

  return { generateHash, generatePreviewItem }
}
