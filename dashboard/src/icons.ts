import Vue from 'vue';

import {
  // faPlay, faFolderOpen, faAddressBook,
  // faCalendarCheck, faCogs,  faEyeSlash,
  // faExclamationCircle,   faAngleDoubleLeft, 
  // faAngleDoubleRight, 
  // faCaretUp, faFile, faBook, 
  // faCodeBranch, 
  // faArrowUp, faTools, faCheck, faSeedling, faDatabase, faGem, 
  // faExchangeAlt, faBug, faStop, faEllipsisV, faPercent,
  // faUsersCog, faCoins, faAngleLeft, faAngleRight,
  // faCreditCard, faStepForward, faRing, faDonate, 
  // faPenNib, faImages,

  faPaperPlane, faFileImage, faPlus, 
  faSync, faEye, faTimes, 
  faTrash, faCloudDownloadAlt, faKey, 
  faExternalLinkAlt, faUpload, faUsers,
  faQuestionCircle, faMinus, faSearch, 
  faInfoCircle, faChevronDown, faChevronUp,
  faHeart, faCaretDown, faInfo, 
  faLink, faCopy, faLanguage
} from '@fortawesome/free-solid-svg-icons';

// throws error, idk why
// import { faHeart } from '@fortawesome/free-regular-svg-icons';

import { faTwitter, faLine, faTelegram, faMedium } from '@fortawesome/free-brands-svg-icons';

import { library } from '@fortawesome/fontawesome-svg-core';

library.add(
  // faTrash, faKey, faSync, faRedo,
  // faCloudDownloadAlt, faPlay, faFolderOpen,
  // faUsers, faAddressBook, faPaperPlane,
  // faCalendarCheck, faCogs, faEye, faEyeSlash,
  // faExclamationCircle, faUpload, faCopy, faAngleDoubleLeft,
  // faAngleDoubleRight, faPlus, faTimes, faCaretDown, 
  // faCaretUp, faMinus, faFile, faBook,
  // faCodeBranch, faQuestionCircle, faExternalLinkAlt,
  // faTwitter, faArrowUp, faTools, faCheck, faSeedling, 
  // faDatabase, faGem, faExchangeAlt,
  // faBug, faStop, faEllipsisV, faPercent, faUsersCog, faCoins,
  // faAngleLeft, faAngleRight, faCreditCard, faStepForward, faRing,
  // faDonate, faFileImage, faPenNib, faImages, faLine

  faPaperPlane, faFileImage, faPlus, 
  faSync, faEye, faTimes, 
  faCopy, faTrash, faCloudDownloadAlt,
  faKey, faExternalLinkAlt, faUpload, 
  faUsers, faQuestionCircle, faMinus, 
  faSearch, faInfoCircle, faChevronDown, 
  faChevronUp, faHeart, faSearch,
  faCaretDown, faInfo, faLink, faLanguage,

  faTwitter, faTelegram, faMedium, faLine, 
  );

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

Vue.component('vue-fontawesome', FontAwesomeIcon);  
