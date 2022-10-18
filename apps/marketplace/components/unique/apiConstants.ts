import type { ApiPromise } from '@polkadot/api'

export function getInstanceDeposit(api: ApiPromise): bigint {
  return api.consts?.uniques?.instanceDeposit?.toBigInt()
}

export function getMetadataDeposit(api: ApiPromise): bigint {
  return api.consts?.uniques?.metadataDepositBase?.toBigInt()
}

export function getDepositPerByte(api: ApiPromise): bigint {
  return api.consts?.uniques?.depositPerByte?.toBigInt()
}

export function getclassDeposit(api: ApiPromise): bigint {
  return api.consts?.uniques?.classDeposit?.toBigInt()
}
