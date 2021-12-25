import Vue from 'vue'
import '@/utils/icons'
import keyring from '@polkadot/ui-keyring'

import Connector from '@vue-polkadot/vue-api'
import { enableExtension } from '@/utils/extension'
import { web3FromAddress } from '@polkadot/extension-dapp'
import 'setimmediate'
import mingo from 'mingo'
import api from '@/utils/fetch'
import { baseIpfsPrice, cost,  getFileSize, supportTx } from '@/utils/support'
import axios from 'axios'
import { set, get, getMany } from 'idb-keyval'


import { useOperators, OperatorType } from 'mingo/core'
import { $match, $group, $project } from 'mingo/operators/pipeline'
import { $sum, $first, $push, $avg } from 'mingo/operators/accumulator'

// ensure the required operators are preloaded prior to using them.
type OperatorMap = Record<string, any>
useOperators(OperatorType.PIPELINE, { $match, $group, $project } as OperatorMap)
useOperators(OperatorType.ACCUMULATOR, { $sum, $first, $push, $avg } as OperatorMap);
// useOperators(OperatorType.EXPRESSION, { $setUnion } as OperatorMap)

(window as any).C = Connector;
(window as any).K = keyring;
(window as any).W = web3FromAddress;
(window as any).mingo = mingo;
(window as any).api = api;
(window as any).P = { baseIpfsPrice, cost, getFileSize, supportTx};
(window as any).axios = axios;
(window as any).S = { get, set, getMany };

(async () => {
  // await createInstance(keyInfo, getPrefixByStoreUrl());
  await enableExtension()
})()
// Connector.createInstance(store.state.setting.apiUrl);
Vue.config.productionTip = false
