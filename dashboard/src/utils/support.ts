const IPFS_REPLICATIONS = 2;
const IPFS_PRICE = 0.15; // 15 euro cents
const MONTHS = 24;
const BYTES = 1000;
import { getKSMUSD } from '@/coingecko'
import Connector from '@vue-polkadot/vue-api'
const BACKUP_PUBKEY = '0x8cc1b91e8946862c2c79915a4bc004926510fcf71c422fde977c0b0e9d9be40e'
import { pubKeyToAddress } from './account';
import store from '@/store'


export const sizeOf = (file: Blob | number): number => typeof file === 'number' ? file : file.size

export const getFileSize = (file: Blob | number) => {
  const size = sizeOf(file)
  const res = ( size / BYTES ** 2 )

  if (res <= 100) {
    return 0.1
  }

  return res / BYTES;
}

// size in gb // yields in cents
export const baseIpfsPrice = (file: Blob | number) => {
  const fileSize = getFileSize(file)
  return IPFS_REPLICATIONS * MONTHS * round(fileSize * IPFS_PRICE)
}

const round = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100

const justFile = (file: Blob | null): boolean =>  !!file;

export const calculateCost = (files: Blob | (Blob | null)[]) => {
  if (Array.isArray(files)) {
    return files.filter(justFile).map(f => baseIpfsPrice(f as Blob)).reduce((a, b) => a + b, 0)
  }

  return baseIpfsPrice(files);
}

export const cost = async (files: Blob | (Blob | null)[]): Promise<number> => {
  const ksmPrice = await getKSMUSD();
  console.log(calculateCost(files) / ksmPrice);
  const decimals = store.getters.getChainProperties?.tokenDecimals
  return Math.round(calculateCost(files) / ksmPrice * 10 ** decimals);
}

export const supportTx = async (files: Blob | (Blob | null)[]) => {
  const { api } = Connector.getInstance()
  return api.tx.balances.transfer(pubKeyToAddress(BACKUP_PUBKEY), await cost(files))
}

