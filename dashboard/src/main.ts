import Vue from 'vue';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import './icons';

import shortAddress from './utils/shortAddress';
import VueClipboard from 'vue-clipboard2';
import formatBalance from '@/utils/formatBalance'
import { toString, toNumber, toPercent } from '@/utils/filters'
import keyring from '@polkadot/ui-keyring';
import './registerServiceWorker'
import App from './App.vue';
import store from './store';
import router from './router';
import Connector from '@vue-polkadot/vue-api';
import { client, keyInfo } from '@/textile'
import { createInstance, getInstance } from '@/components/rmrk/service/RmrkService'
import { Client } from '@textile/hub'
import { enableExtension } from './extension'
import 'setimmediate';

Vue.filter('shortAddress', shortAddress);

(window as any).C = Connector; 
(window as any).K = keyring;
(window as any).T = client;
(window as any).Client = Client;
(window as any).R = getInstance;

(async () => { 
  await createInstance(keyInfo);
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

Vue.use(VueClipboard);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
