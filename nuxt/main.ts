import Vue from 'vue';
import './icons';
import shortAddress from './utils/shortAddress';
import VueClipboard from 'vue-clipboard2';
import formatBalance from '@/utils/formatBalance'
import { toString, toNumber, toPercent, truncateStr, toSanitizedUrl } from '@/utils/filters'
import keyring from '@polkadot/ui-keyring';
import './registerServiceWorker'

import AudioVisual from 'vue-audio-visual'
import VueSocialSharing from 'vue-social-sharing'

Vue.use(AudioVisual)
Vue.use(VueSocialSharing)

import Connector from '@vue-polkadot/vue-api';
import { enableExtension } from './extension'
import { web3FromAddress } from '@polkadot/extension-dapp';
import 'setimmediate';
import mingo from 'mingo'
import api from './fetch'
import { baseIpfsPrice, cost,  getFileSize, supportTx } from './utils/support'
import axios from 'axios'
import { set, get, getMany } from 'idb-keyval';


import { useOperators, OperatorType } from 'mingo/core'
import { $match, $group, $project } from 'mingo/operators/pipeline'
import { $sum, $first, $push, $avg } from 'mingo/operators/accumulator'

// ensure the required operators are preloaded prior to using them.
type OperatorMap = Record<string, any> ;
useOperators(OperatorType.PIPELINE, { $match, $group, $project } as OperatorMap)
useOperators(OperatorType.ACCUMULATOR, { $sum, $first, $push, $avg } as OperatorMap)
// useOperators(OperatorType.EXPRESSION, { $setUnion } as OperatorMap)

Vue.filter('shortAddress', shortAddress);

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
  await enableExtension();
})()
// Connector.createInstance(store.state.setting.apiUrl);
Vue.prototype.$http = Connector.getInstance();

Vue.filter('formatBalance', formatBalance)
Vue.filter('toString', toString)
Vue.filter('toNumber', toNumber)
Vue.filter('toPercent', toPercent)
Vue.filter('truncateStr', truncateStr)
Vue.filter('toSanitizedUrl', toSanitizedUrl)

Vue.use(VueClipboard);

Vue.config.productionTip = false;
