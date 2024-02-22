const correctFormat = (ss58?: number | string | null): number => {
  switch (typeof ss58) {
    case 'number':
      return ss58
    case 'string':
      return Number(ss58) >= 0 ? Number(ss58) : 42
    default:
      return 42
  }
}

// https://github.com/polkadot-js/common/blob/db25938ad7867d98abad0cdb457b6aabb4bec38b/packages/util-crypto/src/address/encode.ts#L18
export const isValidSs58Format = (ss58Format: number): boolean =>
  !Boolean(
    ss58Format < 0 || ss58Format > 16383 || [46, 47].includes(ss58Format),
  )

export default correctFormat
