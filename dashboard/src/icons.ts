import Vue from 'vue';

import {
  faTrash, faKey, faSync, faRedo,
  faCloudDownloadAlt, faPlay, faFolderOpen,
  faUsers, faAddressBook, faPaperPlane,
  faCalendarCheck, faCogs, faEye, faEyeSlash,
  faExclamationCircle, faUpload, faCopy, faAngleDoubleLeft, 
  faAngleDoubleRight, faPlus, faTimes, faCaretDown, 
  faCaretUp, faMinus, faFile, faBook, 
  faCodeBranch, faSearch, faQuestionCircle, faExternalLinkAlt, 
<<<<<<< HEAD
  faArrowUp, faTools, faCheck, faSeedling, faBug
=======
  faArrowUp, faTools, faCheck, faSeedling, faDatabase, faGem, 
  faInfoCircle, faHandPointUp
>>>>>>> develop
} from '@fortawesome/free-solid-svg-icons';

import { faTwitter } from '@fortawesome/free-brands-svg-icons';

import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faTrash, faKey, faSync, faRedo,
  faCloudDownloadAlt, faPlay, faFolderOpen,
  faUsers, faAddressBook, faPaperPlane,
  faCalendarCheck, faCogs, faEye, faEyeSlash,
  faExclamationCircle, faUpload, faCopy, faAngleDoubleLeft,
  faAngleDoubleRight, faPlus, faTimes, faCaretDown, 
  faCaretUp, faMinus, faFile, faBook,
  faCodeBranch, faSearch, faQuestionCircle, faExternalLinkAlt,
<<<<<<< HEAD
  faTwitter, faArrowUp, faTools, faCheck, faSeedling,
  faBug);
=======
  faTwitter, faArrowUp, faTools, faCheck, faSeedling, faDatabase, faGem,
  faInfoCircle, faHandPointUp );
>>>>>>> develop

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
Vue.component('vue-fontawesome', FontAwesomeIcon);  
