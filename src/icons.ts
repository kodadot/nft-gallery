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
  faSync, faTimes,
  faTrash, faCloudDownloadAlt, faKey,
  faExternalLinkAlt, faUpload, faUsers,
  faQuestionCircle, faMinus, faSearch,
  faInfoCircle, faChevronDown, faChevronUp,
  faHeart, faCaretDown, faInfo,
  faShareSquare, faCopy, faBookmark,
  faLink, faLanguage,
  faQuestion, faPrint,
  faMagic, faEye, faCommentAlt,
  faGhost, faCode, faLeaf,
  faFlask, faCameraRetro, faTag,
  faShareAlt, faExclamationTriangle,
  faCalendar, faCalculator, faEnvelope,
  faArrowsAlt, faCompressAlt, faCompressArrowsAlt,
  faAngleLeft, faAngleRight, faReply, faExternalLinkSquareAlt
} from '@fortawesome/free-solid-svg-icons';

// throws error, idk why
import { faCommentDots, faThumbsUp, faThumbsDown } from '@fortawesome/free-regular-svg-icons';

import {
  faTwitter, faLine, faTelegram,
  faFacebook, faFacebookMessenger,
  faTelegramPlane, faMedium, faWhatsapp,
  faPinterest, faWpexplorer, faDiscord,
  faRedditAlien
} from '@fortawesome/free-brands-svg-icons';

import { library, IconDefinition } from '@fortawesome/fontawesome-svg-core';

library.add(
  // faTrash, faKey, faSync, faRedo,
  // faCloudDownloadAlt, faPlay, faFolderOpen,
  // faUsers, faAddressBook, faPaperPlane,
  // faCalendarCheck, faCogs, faEye, faEyeSlash,
  // faExclamationCircle, faUpload, faCopy, faAngleDoubleLeft,
  // faAngleDoubleRight, faPlus, faTimes, faCaretDown,
  // faCaretUp, faMinus, faFile, faBook,
  // faCodeBranch, faQuestionCircle, faExternalLinkAlt,
  // faTwitter, faArrowUp, faTools, faCheck, faSeedling,w
  // faDatabase, faGem, faExchangeAlt,
  // faBug, faStop, faEllipsisV, faPercent, faUsersCog, faCoins,
  // faAngleLeft, faAngleRight, faCreditCard, faStepForward, faRing,
  // faDonate, faFileImage, faPenNib, faImages, faLine

  faPaperPlane, faFileImage, faPlus,
  faSync, faTimes,
  faCopy, faTrash, faCloudDownloadAlt,
  faKey, faExternalLinkAlt, faUpload,
  faUsers, faQuestionCircle, faMinus,
  faSearch, faInfoCircle, faChevronDown,
  faChevronUp, faHeart,
  faCaretDown, faInfo, faShareSquare,
  faBookmark, faLink,
  faLanguage, faQuestion, faEye,
  faPrint, faCommentAlt, faMagic,
  faLeaf, faFlask,
  faCalendar, faEnvelope,
  faCommentDots, faGhost, faCode,
  faWpexplorer,
  faRedditAlien, faCameraRetro,
  faTag, faShareAlt,
  faExclamationTriangle, faCalculator,
  faArrowsAlt, faCompressAlt, faCompressArrowsAlt,

  // Social
  faTwitter, faTelegram, faFacebook,
  faFacebookMessenger, faDiscord,
  faLine, faTelegramPlane, faWhatsapp,
  faPinterest, faMedium,
  faAngleLeft, faAngleRight,
  faReply, faThumbsUp, faThumbsDown,
  faExternalLinkSquareAlt
  );

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

Vue.component('vue-fontawesome', FontAwesomeIcon);
