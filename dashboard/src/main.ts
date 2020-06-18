import Vue from 'vue';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import './icons';

import shortAddress from './utils/shortAddress';
import VueClipboard from 'vue-clipboard2';

import './registerServiceWorker'
import App from './App.vue';
import store from './store';
import router from './router';
import Connector from '@vue-polkadot/vue-api';

import 'aframe';
Vue.config.ignoredElements = [
  'a-scene',
  'a-assets',
  'a-box',
  'a-cylinder',
  'a-text',
  'a-sphere',
  'a-plane',
  'a-sky',
  'a-camera',
  'a-cursor',
  'a-entity'
]

Vue.filter('shortAddress', shortAddress);

(window as any).C = Connector; 
// Connector.createInstance(store.state.setting.apiUrl);
Vue.prototype.$http = Connector.getInstance(); 

Vue.use(Buefy, {
  defaultIconPack: 'fas',
  defaultIconComponent: 'vue-fontawesome',
  defaultFieldLabelPosition: 'inside',
  customIconPacks: {
    fas: {
      sizes: {
        'default': null,
        'is-small': '1x',
        'is-medium': '2x',
        'is-large': '3x',
      },
    },
  },
});
    
Vue.use(VueClipboard);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
