import { getRandomIntFromRange } from '@/components/collection/unlockable/utils'
import { blake2AsHex, encodeAddress } from '@polkadot/util-crypto'

const ENTROPY_RANGE_STEP = 64

export default () => {
  const { accountId } = useAuth()

  const getEntropyRange = (minted: number): [number, number] => [
    ENTROPY_RANGE_STEP * minted,
    ENTROPY_RANGE_STEP * (minted + 1),
  ]

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

  const generateHash = (range: [number, number]) =>
    getHash(getRandomIntFromRange(...range))

  return { generateHash, getEntropyRange }
}
