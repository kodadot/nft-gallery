import Vue from 'vue';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faKey, faSync, faRedo,
  faCloudDownloadAlt, faPlay, faFolderOpen,
  faUsers, faAddressBook, faPaperPlane,
  faCalendarCheck, faCogs, faEye, faEyeSlash,
  faExclamationCircle, faUpload, 
  faCopy, faAngleDoubleLeft, faAngleDoubleRight,
  faPlus, faTimes, faCaretDown, faCaretUp, faMinus,
  faFile, faBook, faCodeBranch, faSearch, faQuestionCircle,
  faExternalLinkAlt, faArrowUp, faTools, faCheck, faGem
 } from '@fortawesome/free-solid-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueClipboard from 'vue-clipboard2';
import formatBalance from '@/utils/formatBalance'
import { toString, toNumber } from '@/utils/filters'
// import keyring from '@vue-polkadot/vue-keyring';

import App from './App.vue';
import store from './store';
import router from './router';
import Connector from '@vue-polkadot/vue-api';

library.add(faTrash, faKey, faSync, faRedo,
  faCloudDownloadAlt, faPlay, faFolderOpen,
  faUsers, faAddressBook, faPaperPlane,
  faCalendarCheck, faCogs, faEye, faEyeSlash,
  faExclamationCircle, faUpload, 
  faCopy, faAngleDoubleLeft, faAngleDoubleRight,
  faPlus, faTimes, faCaretDown, faCaretUp,
  faMinus, faFile, faBook, faCodeBranch, faSearch, faQuestionCircle,
  faExternalLinkAlt, faTwitter, faArrowUp, faTools, faCheck, faGem );

Vue.component('vue-fontawesome', FontAwesomeIcon);

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

Vue.filter('formatBalance', formatBalance)
Vue.filter('toString', toString)
Vue.filter('toNumber', toNumber)

Vue.use(VueClipboard);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
