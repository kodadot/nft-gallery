// Copyright 2017-2020 @vue-polkadot authors & @polkadot original authors.
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { TypeDefInfo } from '@polkadot/types/types'
import BN from 'bn.js'
import { createType, getTypeDef } from '@polkadot/types'
import registry from './typeRegistry'
import Account from './Account.vue'
import Amount from './Amount.vue'
import Balance from './Balance.vue'
import Bool from './Bool.vue'
import Bytes from './Bytes.vue'
import Call from './Call.vue'
import Code from './Code.vue'
import DispatchError from './DispatchError.vue'
import Enum from './Enum.vue'
import Hash256 from './Hash256.vue'
import Hash512 from './Hash512.vue'
import KeyValue from './KeyValue.vue'
import KeyValueArray from './KeyValueArray.vue'
import Moment from './Moment.vue'
import Null from './Null.vue'
import OpaqueCall from './OpaqueCall.vue'
import Option from './Option.vue'
import Raw from './Raw.vue'
import Struct from './Struct.vue'
import TextField from './TextField.vue'
import Tuple from './Tuple.vue'
import Unknown from './Unknown.vue'
import Vector from './Vector.vue'
import Vote from './Vote.vue'
import VoteThreshold from './VoteThreshold.vue'
const components = [
  { c: Account, t: ['AccountId', 'AccountIdOf', 'Address', 'AuthorityId', 'LookupSource', 'LookupTarget', 'SessionKey', 'ValidatorId'] },
  { c: Amount, t: ['AccountIndex', 'AssetId', 'BlockNumber', 'Gas', 'Index', 'Nonce', 'ParaId', 'ProposalIndex', 'PropIndex', 'ReferendumIndex', 'i8', 'i16', 'i32', 'i64', 'i128', 'u8', 'u16', 'u32', 'u64', 'u128', 'u256', 'VoteIndex'] },
  { c: Balance, t: ['Amount', 'AssetOf', 'Balance', 'BalanceOf'] },
  { c: Bool, t: ['bool'] },
  { c: Bytes, t: ['Bytes'] },
  { c: Call, t: ['Call', 'Proposal'] },
  { c: Code, t: ['Code'] },
  { c: DispatchError, t: ['DispatchError'] },
  { c: Raw, t: ['Raw', 'Keys'] },
  { c: Enum, t: ['Enum'] },
  { c: Hash256, t: ['BlockHash', 'CodeHash', 'Hash', 'H256', 'SeedOf'] },
  { c: Hash512, t: ['H512', 'Signature'] },
  { c: KeyValue, t: ['KeyValue'] },
  { c: KeyValueArray, t: ['Vec<KeyValue>'] },
  { c: Moment, t: ['Moment', 'MomentOf'] },
  { c: Null, t: ['Null'] },
  { c: OpaqueCall, t: ['OpaqueCall'] },
  { c: Option, t: ['Option'] },
  { c: TextField, t: ['String', 'Text'] },
  { c: Struct, t: ['Struct'] },
  { c: Tuple, t: ['Tuple'] },
  { c: Vector, t: ['Vec'] },
  { c: Vote, t: ['Vote'] },
  { c: VoteThreshold, t: ['VoteThreshold'] },
  { c: Unknown, t: ['Unknown'] },
].reduce((componentList, { c, t }) => {
  t.forEach((type) => {
    componentList[type] = c
  })
  return componentList
}, {})
const getType = (({ displayName, info, sub, type }) => {
  if (displayName) {
    return displayName
  }
  switch (info) {
  case TypeDefInfo.Compact:
    return sub.type
  case TypeDefInfo.Option:
    return 'Option'
  case TypeDefInfo.Enum:
    return 'Enum'
  case TypeDefInfo.Struct:
    return 'Struct'
  case TypeDefInfo.Tuple:
    if (components[type] === Account) {
      return type
    }
    return 'Tuple'
  case TypeDefInfo.Vec:
    return ['Vec<KeyValue>'].includes(type)
      ? 'Vec<KeyValue>'
      : 'Vec'
  default:
    return type
  }
})
export default function findComponent(def, overrides = {}) {
  console.log(def)
  const findOne = (componentType) => {
    return overrides[componentType] || components[componentType]
  }
  const type = getType(def)
  let Component = findOne(type)
  if (!Component) {
    try {
      const instance = createType(registry, type)
      const raw = getTypeDef(instance.toRawType())
      Component = findOne(getType(raw))
      if (Component) {
        return Component
      }
      else if (instance instanceof BN) {
        return Amount
      }
      else if ([TypeDefInfo.Enum, TypeDefInfo.Struct].includes(raw.info)) {
        return findComponent(raw, overrides)
      }
    }
    catch (error) {
      // console.error(error.message);
    }
    console.warn(`Cannot find Component for ${type}, defaulting to Unknown`)
  }
  return Component || Unknown
}
//# sourceMappingURL=findComponent.js.map