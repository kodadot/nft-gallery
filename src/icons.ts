import Vue from 'vue'

import {
  faPaperPlane, faFileImage, faPlus,
  faSync, faTimes,
  faTrash, faCloudDownloadAlt, faKey,
  faExternalLinkAlt, faUpload, faUsers,
  faQuestionCircle, faMinus, faSearch,
  faInfoCircle, faChevronDown, faChevronUp, faChevronLeft,
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
  faAngleLeft, faAngleRight, faReply,
  faExternalLinkSquareAlt, faGift, faThLarge, faTh,
  faEyeSlash, faArrowUp, faUser, faGlobe, faExclamationCircle, faFilter,

} from '@fortawesome/free-solid-svg-icons'

// throws error, idk why
import { faCommentDots, faThumbsUp, faThumbsDown } from '@fortawesome/free-regular-svg-icons'

import {
  faTwitter, faLine, faTelegram,
  faFacebook, faFacebookMessenger,
  faTelegramPlane, faMedium, faWhatsapp,
  faPinterest, faWpexplorer, faDiscord,
  faRedditAlien,
  faYoutube
} from '@fortawesome/free-brands-svg-icons'

import { library, IconDefinition } from '@fortawesome/fontawesome-svg-core'

library.add(
  faPaperPlane, faFileImage, faPlus,
  faSync, faTimes,
  faCopy, faTrash, faCloudDownloadAlt,
  faKey, faExternalLinkAlt, faUpload,
  faUsers, faQuestionCircle, faMinus,
  faSearch, faInfoCircle, faChevronDown,
  faChevronUp, faChevronLeft, faHeart,
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
  faEyeSlash, faArrowUp, faUser, faGlobe,
  faExclamationCircle, faFilter, faGift, faThLarge, faTh,

  // Social
  faTwitter, faTelegram, faFacebook,
  faFacebookMessenger, faDiscord,
  faLine, faTelegramPlane, faWhatsapp,
  faPinterest, faMedium,
  faAngleLeft, faAngleRight,
  faReply, faThumbsUp, faThumbsDown,
  faExternalLinkSquareAlt,
  faYoutube

)

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.component('vue-fontawesome', FontAwesomeIcon)
