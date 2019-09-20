import Vue from 'vue';
import App from './App.vue';
import store from './store';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faKey, faSync, faRedo,
  faCloudDownloadAlt, faPlay, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faTrash, faKey, faSync, faRedo, 
  faCloudDownloadAlt, faPlay, faFolderOpen );

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(Buefy);

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
