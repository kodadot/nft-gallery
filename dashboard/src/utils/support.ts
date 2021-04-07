const IPFS_REPLICATIONS = 2;
const IPFS_PRICE = 0.15; // 15 euro cents
const MONTHS = 24;
const BYTES = 1000;
const MINUMUM_MB_STORAGE = 10;
const PERCENT = 0.02; // percent / 100
import { getKSMUSD } from '@/coingecko'
import Connector from '@vue-polkadot/vue-api'
const BACKUP_PUBKEY = '0x8cc1b91e8946862c2c79915a4bc004926510fcf71c422fde977c0b0e9d9be40e'
const KODADOT_DAO = 'CykZSc3szpVd95PmmJ45wE4ez7Vj3xkhRFS9H4U1WdrkaFY'
import { pubKeyToAddress } from './account';
import store from '@/store'

export type MaybeFile = File | Blob | null
type FileType = MaybeFile | MaybeFile[]

export const sizeOf = (file: Blob | number): number => typeof file === 'number' ? file : file.size

export const getFileSize = (file: Blob | number) => {
  const size = sizeOf(file)
  const res = ( size / BYTES ** 2 )

  // Minu
  if (res <= MINUMUM_MB_STORAGE) {
    return 0.01
  }

  return res / BYTES;
}

// size in gb // yields in cents
export const baseIpfsPrice = (file: Blob | number) => {
  const fileSize = getFileSize(file)
  return IPFS_REPLICATIONS * MONTHS * fileSize * IPFS_PRICE
}

export const round = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100
const sum = (a: number, b: number) => a + b

const justFile = (file: MaybeFile): boolean =>  !!file;


export const calculateCost = (files: FileType) => {
  if (Array.isArray(files)) {
    const allReadyAdded: Record<string, boolean> = {}
    return files
    .filter(justFile)
    .filter(f => {
      if (f instanceof File) {
        if (allReadyAdded[f.name]) {
          return false
        }

        allReadyAdded[f.name] = true;
        return true
      }

      return true
    })
    .map(f => baseIpfsPrice(f as Blob))
    .reduce(sum, 0)
  }

  return files ? baseIpfsPrice(files) : 0
}

export const cost = async (files: FileType): Promise<number> => {
  const ksmPrice = await getKSMUSD();
  console.log(calculateCost(files) / ksmPrice);
  const decimals = store.getters.getChainProperties?.tokenDecimals
  return Math.round(calculateCost(files) / ksmPrice * 10 ** decimals);
}

export const supportTx = async (files:FileType) => {
  const { api } = Connector.getInstance()
  return api.tx.balances.transfer(resolveSupportAddress(), await cost(files))
}

export const somePercentFromTX = (price: number | string) => {
  const { api } = Connector.getInstance()
  const fee = Number(price) * PERCENT
  return api.tx.balances.transfer(resolveSupportAddress() , fee)
}

export const resolveSupportAddress = () => {
  const ss58Format = store.getters.getChainProperties?.ss58Format
  return Number(ss58Format) === 2 ? KODADOT_DAO : pubKeyToAddress(BACKUP_PUBKEY)
}
