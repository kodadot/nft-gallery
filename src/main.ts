import Vue from 'vue';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import './icons';

import shortAddress from './utils/shortAddress';
import VueClipboard from 'vue-clipboard2';
import formatBalance from '@/utils/formatBalance'
import { toString, toNumber, toPercent, truncateStr, toSanitizedUrl } from '@/utils/filters'
import keyring from '@polkadot/ui-keyring';
import './registerServiceWorker'
import App from './App.vue';
import store from './store';
import router from './router';

import MetaInfo from 'vue-meta';
import AudioVisual from 'vue-audio-visual'
import VueSocialSharing from 'vue-social-sharing'
import VueApollo from 'vue-apollo'

Vue.use(MetaInfo)
Vue.use(AudioVisual)
Vue.use(VueSocialSharing)
Vue.use(VueApollo)

import Connector from '@vue-polkadot/vue-api';
import { enableExtension } from './extension'
import { web3FromAddress } from '@polkadot/extension-dapp';
import 'setimmediate';
import i18n from './i18n'
import mingo from 'mingo'
import api from './fetch'
import { baseIpfsPrice, cost,  getFileSize, supportTx } from './utils/support'
import axios from 'axios'
import { set, get, getMany } from 'idb-keyval';


import { useOperators, OperatorType } from 'mingo/core'
import { $match, $group, $project } from 'mingo/operators/pipeline'
import { $sum, $first, $push, $avg } from 'mingo/operators/accumulator'
// import { $setUnion } from 'mingo/operators/expression/set'
import apolloClient from './subquery';
import { resolveSubsocialApi } from './components/subsocial/api';
// import { resolveSubsocialApi } from '@/components/subsocial/api';

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


Vue.use(Buefy, {
  defaultIconPack: 'fas',
  defaultIconComponent: 'vue-fontawesome',
  defaultFieldLabelPosition: 'inside',
  customIconPacks: {
    fas: {
      // sizes: {
      //   'default': '',
      //   'is-small': '1x',
      //   'is-medium': '2x',
      //   'is-large': '3x',
      // },
    },
  },
});

Vue.filter('formatBalance', formatBalance)
Vue.filter('toString', toString)
Vue.filter('toNumber', toNumber)
Vue.filter('toPercent', toPercent)
Vue.filter('truncateStr', truncateStr)
Vue.filter('toSanitizedUrl', toSanitizedUrl)

Vue.use(VueClipboard);

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  apolloProvider,
  i18n,
  render: (h) => h(App)
}).$mount('#app');
