import type { ApiPromise } from '@polkadot/api'
import { balanceOf } from '@kodadot1/sub-api'

import type { PalletBalancesAccountData } from '@polkadot/types/lookup'

export declare type Unsubscribe = () => void
export type UnsubscribePromise = Promise<Unsubscribe>

function simpleMultiply(value: string | number, decimals = 0): string {
  return (BigInt(value) * BigInt(10 ** decimals)).toString()
}

export function simpleDivision(value: string | number, decimals = 0): number {
  return Number(value) / 10 ** decimals
}

function validateInput(input: number | string): void {
  const value = Number(input)
  if (Number.isNaN(value)) {
    throw new Error('[BALANCE] Value has to be a number')
  }

  if (value < 0) {
    throw new RangeError('[BALANCE] Value has to be positive')
  }
}

export function balanceFrom(input: number | string, decimals = 12): string {
  validateInput(input)
  const value = String(input)
  const isDecimalValue = value.match(/^(\d+)\.(\d+)$/)
  if (isDecimalValue) {
    const [, whole, fraction] = isDecimalValue
    if (fraction.length > decimals) {
      throw new RangeError(
        `Fractional part is too long: ${fraction.length} > ${decimals}`,
      )
    }

    return simpleMultiply(whole + fraction, decimals - fraction.length)
  }

  return simpleMultiply(value, decimals)
}

export function subscribeBalance(
  api: ApiPromise,
  address: string,
  cb: (value: string) => void,
): UnsubscribePromise {
  return api.derive.balances.all(address, ({ availableBalance }) => {
    cb(availableBalance.toString())
  })
}

export const getNativeBalance = async ({
  address,
  api,
  tokenId = 0,
}: {
  address: string
  api: ApiPromise
  tokenId: number
}): Promise<string | number> => {
  if (tokenId) {
    return (
      (await api.query.tokens.accounts(
        address,
        tokenId,
      )) as PalletBalancesAccountData
    ).free.toString()
  }

  return balanceOf(api, address)
}
