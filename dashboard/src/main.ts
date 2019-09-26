import Vue from 'vue';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faKey, faSync, faRedo,
  faCloudDownloadAlt, faPlay, faFolderOpen,
  faUsers, faAddressBook, faPaperPlane,
  faCalendarCheck, faCogs, faEye, faEyeSlash,
  faExclamationCircle, faUpload, faDiceD20 } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import App from './App.vue';
import store from './store';
import router from './router';

library.add(faTrash, faKey, faSync, faRedo,
  faCloudDownloadAlt, faPlay, faFolderOpen,
  faUsers, faAddressBook, faPaperPlane,
  faCalendarCheck, faCogs, faEye, faEyeSlash,
  faExclamationCircle, faUpload, faDiceD20 );

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(Buefy, {
  defaultIconPack: 'fas',
  defaultIconComponent: 'font-awesome-icon',
  defaultFieldLabelPosition: 'inside',
  customIconPacks: {
    fas: {
      sizes: {
        'default': 'lg',
        'is-small': '1x',
        'is-medium': '2x',
        'is-large': '3x',
      },
    },
  },
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
