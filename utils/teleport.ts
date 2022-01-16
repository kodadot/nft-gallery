// Copyright 2017-2021 @polkadot/app-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api'
import { SubmittableExtrinsicFunction } from '@polkadot/api/types'
import { XcmVersionedMultiLocation } from '@polkadot/types/lookup'
import { AnyTuple } from '@polkadot/types/types'
import { BN_ZERO, isFunction } from '@polkadot/util'

type Extrisic = SubmittableExtrinsicFunction<'promise', AnyTuple>

// import { KUSAMA_GENESIS } from '@polkadot/apps-config';

const KUSAMA_GENESIS = ''
// 4 * BaseXcmWeight on Kusama
const KUSAMA_WEIGHT = 4 * 1_000_000_000

const DEFAULT_WEIGHT = KUSAMA_WEIGHT

const KNOWN_WEIGHTS: Record<string, number> = {
  [KUSAMA_GENESIS]: KUSAMA_WEIGHT,
}

export function getTeleportWeight(api: ApiPromise): number {
  return KNOWN_WEIGHTS[api.genesisHash.toHex()] || DEFAULT_WEIGHT
}

export function findCall(api: ApiPromise): Extrisic {
  const m = XCM_LOC.filter(
    (x) => api.tx[x] && XCM_FNS.some((f) => isFunction(api.tx[x][f]))
  )[0]
  const f = XCM_FNS.filter((f) => isFunction(api.tx[m][f]))[0]

  return api.tx[m][f]
}

export const XCM_LOC = ['xcm', 'xcmPallet', 'polkadotXcm']
export const XCM_FNS = ['limitedTeleportAssets', 'teleportAssets']

export function getApiParams(
  api: ApiPromise,
  call: Extrisic,
  isParaTeleport: string | undefined,
  account: string,
  amount: string
): any[] {
  const firstType = api.createType<XcmVersionedMultiLocation>(
    call.meta.args[0].type.toString()
  )
  const isCurrent = firstType.defKeys.includes('V1')

  const dst = isParaTeleport ? { X1: 'Parent' } : { X1: { ParaChain: 1000 } }

  const acc = {
    X1: {
      AccountId32: {
        id: api.createType('AccountId32', account).toHex(),
        network: 'Any',
      },
    },
  }
  const ass = isParaTeleport
    ? [{ ConcreteFungible: { amount, id: { X1: 'Parent' } } }]
    : // forgo id - 'Here' for 9100, 'Null' for 9110 (both is the default enum value)
      [{ ConcreteFungible: { amount } }]

  const destWeight = getTeleportWeight(api)

  return isCurrent
    ? call.meta.args.length === 5
      ? // with weight
        call.method === 'limitedTeleportAssets'
        ? [{ V0: dst }, { V0: acc }, { V0: ass }, 0, { Unlimited: null }]
        : [{ V0: dst }, { V0: acc }, { V0: ass }, 0, destWeight]
      : // without weight
        [{ V0: dst }, { V0: acc }, { V0: ass }, 0]
    : [dst, acc, ass, destWeight]
}
