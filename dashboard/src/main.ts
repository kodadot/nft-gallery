import Vue from 'vue';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import './icons';

import shortAddress from './utils/shortAddress';
import VueClipboard from 'vue-clipboard2';
import VueScreen from 'vue-screen';
import formatBalance from '@/utils/formatBalance'
import { toString, toNumber, toPercent, truncateStr } from '@/utils/filters'
import keyring from '@polkadot/ui-keyring';
import './registerServiceWorker'
import App from './App.vue';
import store from './store';
import router from './router';

import MetaInfo from 'vue-meta';
import AudioVisual from 'vue-audio-visual'

Vue.use(VueScreen, 'bulma');
Vue.use(MetaInfo)
Vue.use(AudioVisual)
import Connector from '@vue-polkadot/vue-api';
import { client, keyInfo } from '@/textile'
import { createInstance, getInstance, migrateCollection, migrateNFT } from '@/components/rmrk/service/RmrkService'
import { enableExtension } from './extension'
import { web3FromAddress } from '@polkadot/extension-dapp';
import { getPrefixByStoreUrl } from '@/utils/chain'
import 'setimmediate';
import i18n from './i18n'
import mingo from 'mingo'
import api from './fetch'

import { useOperators, OperatorType } from 'mingo/core'
import { $match, $group, $project } from 'mingo/operators/pipeline'
import { $sum, $first, $push } from 'mingo/operators/accumulator'

// ensure the required operators are preloaded prior to using them.
type OperatorMap = Record<string, any> ;
useOperators(OperatorType.PIPELINE, { $match, $group, $project } as OperatorMap)
useOperators(OperatorType.ACCUMULATOR, { $sum, $first, $push } as OperatorMap)

Vue.filter('shortAddress', shortAddress);

(window as any).C = Connector;
(window as any).K = keyring;
(window as any).T = client;
(window as any).R = getInstance;
(window as any).W = web3FromAddress;
(window as any).mingo = mingo;
(window as any).api = api;
// (window as any).migrateCollection = migrateCollection;
// (window as any).migrateNFT = migrateNFT;

(async () => {
  await createInstance(keyInfo, getPrefixByStoreUrl());
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
      sizes: {
        'default': '',
        'is-small': '1x',
        'is-medium': '2x',
        'is-large': '3x',
      },
    },
  },
});

Vue.filter('formatBalance', formatBalance)
Vue.filter('toString', toString)
Vue.filter('toNumber', toNumber)
Vue.filter('toPercent', toPercent)
Vue.filter('truncateStr', truncateStr)

Vue.use(VueClipboard);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App)
}).$mount('#app');
