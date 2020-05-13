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
  faExternalLinkAlt, faArrowUp, faTools, faCheck
 } from '@fortawesome/free-solid-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import shortAddress from './utils/shortAddress';
import VueClipboard from 'vue-clipboard2';
// import keyring from '@vue-polkadot/vue-keyring';

import App from './App.vue';
import store from './store';
import router from './router';
import Connector from '@vue-polkadot/vue-api';
// import shortAddress from './utils/shortAddress';

library.add(faTrash, faKey, faSync, faRedo,
  faCloudDownloadAlt, faPlay, faFolderOpen,
  faUsers, faAddressBook, faPaperPlane,
  faCalendarCheck, faCogs, faEye, faEyeSlash,
  faExclamationCircle, faUpload, 
  faCopy, faAngleDoubleLeft, faAngleDoubleRight,
  faPlus, faTimes, faCaretDown, faCaretUp,
  faMinus, faFile, faBook, faCodeBranch, faSearch, faQuestionCircle,
  faExternalLinkAlt, faTwitter, faArrowUp, faTools, faCheck );
  
Vue.component('vue-fontawesome', FontAwesomeIcon);  
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
