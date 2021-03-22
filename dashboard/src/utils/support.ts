const IPFS_REPLICATIONS = 2;
const IPFS_PRICE = 15; // 15 euro cents
const MONTHS = 24;
const BYTES = 1000;

export const sizeOf = (file: File | number): number => typeof file === 'number' ? file : file.size

export const getFileSize = (file: File | number) => {
  const size = sizeOf(file)
  const res = ( size / BYTES ** 2 )

  if (res <= 100) {
    return 0.1
  }

  return res / BYTES;
}

// size in gb // yields in cents
export const baseIpfsPrice = (file: File | number) => {
  const fileSize = getFileSize(file)
  return IPFS_REPLICATIONS * MONTHS * round(fileSize * IPFS_PRICE)
}

const round = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100
