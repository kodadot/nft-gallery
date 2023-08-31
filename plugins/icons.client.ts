<<<<<<< HEAD:plugins/icons.client.ts
=======
// import Vue from 'vue'
>>>>>>> nuxt:plugins/icons.ts
import { Neo } from '@kodadot1/brick'

import { config, library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
  faAngleLeft,
  faAngleRight,
  faArrowRight,
  faArrowUp,
  faArrowUpRightFromSquare,
  faArrowsAlt,
  faBars,
  faBell,
  faBookOpen,
  faBookmark,
  faCalculator,
  faCalendar,
  faCameraRetro,
  faCaretDown,
  faCaretUp,
  faChartLine,
  faCheck,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faClock,
  faCloudDownloadAlt,
  faCode,
  faCommentAlt,
  faCompress,
  faCompressAlt,
  faCompressArrowsAlt,
  faCopy,
  faCube,
  faDice,
  faDownload,
  faEllipsisH,
  faEllipsisV,
  faEnvelope,
  faExclamationCircle,
  faExclamationTriangle,
  faExpand,
  faExternalLinkAlt,
  faExternalLinkSquareAlt,
  faEye,
  faEyeSlash,
  faFileImage,
  faFilter,
  faFire,
  faFireFlameCurved,
  faFlask,
  faGhost,
  faGift,
  faGlobe,
  faHeart,
  faHistory,
  faImage,
  faInfo,
  faInfoCircle,
  faKey,
  faLanguage,
  faLeaf,
  faLightbulb,
  faLink,
  faListUl,
  faMagic,
  faMinus,
  faMoneyBill,
  faMoneyBillAlt,
  faPalette,
  faPaperPlane,
  faPlus,
  faPrint,
  faQrcode,
  faQuestion,
  faQuestionCircle,
  faReply,
  faSearch,
  faShare,
  faShareAlt,
  faShareSquare,
  faShop,
  faSignOutAlt,
  faSort,
  faSquareArrowUpRight,
  faSync,
  faTable,
  faTag,
  faTh,
  faThLarge,
  faTimes,
  faTimesCircle,
  faTrash,
  faUpload,
  faUser,
  faUserCircle,
  faUsers,
  faWallet,
  faX,
} from '@fortawesome/free-solid-svg-icons'

// throws error, idk why
import {
  faCommentDots,
  faThumbsDown,
  faThumbsUp,
} from '@fortawesome/free-regular-svg-icons'

import {
  faDiscord,
  faFacebook,
  faFacebookMessenger,
  faInstagram,
  faLine,
  faMedium,
  faPinterest,
  faRedditAlien,
  faTelegram,
  faTelegramPlane,
  faWhatsapp,
  faWpexplorer,
  faXTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons'

library.add(
  faArrowRight,
  faSort,
  faArrowUpRightFromSquare,
  faSquareArrowUpRight,
  faBars,
  faBell,
  faBookOpen,
  faPaperPlane,
  faFileImage,
  faPlus,
  faSync,
  faTimes,
  faTimesCircle,
  faCopy,
  faTrash,
  faCloudDownloadAlt,
  faKey,
  faExternalLinkAlt,
  faUpload,
  faUsers,
  faEllipsisV,
  faQuestionCircle,
  faMinus,
  faSearch,
  faInfoCircle,
  faChevronDown,
  faChevronUp,
  faChevronLeft,
  faChevronRight,
  faCaretDown,
  faCaretUp,
  faInfo,
  faShareSquare,
  faShop,
  faBookmark,
  faLink,
  faHeart,
  faLanguage,
  faQuestion,
  faEye,
  faPrint,
  faCommentAlt,
  faMagic,
  faDice,
  faLeaf,
  faFlask,
  faCalendar,
  faEnvelope,
  faClock,
  faCommentDots,
  faGhost,
  faCode,
  faWpexplorer,
  faRedditAlien,
  faCameraRetro,
  faTag,
  faShareAlt,
  faShare,
  faExclamationTriangle,
  faCalculator,
  faArrowsAlt,
  faCompressAlt,
  faCompress,
  faCompressArrowsAlt,
  faTable,
  faEyeSlash,
  faArrowUp,
  faUser,
  faUserCircle,
  faGlobe,
  faExclamationCircle,
  faFilter,
  faQrcode,
  faGift,
  faThLarge,
  faTh,
  faFire,
  faFireFlameCurved,
  faMoneyBill,
  faMoneyBillAlt,
  faPalette,
  faHistory,
  faEllipsisH,
  faLightbulb,
  faCube,
  faExpand,
  faImage,
  faSignOutAlt,
  faWallet,
  faChartLine,
  faListUl,
  faDownload,
  faCheck,

  // Social
  faXTwitter,
  faTelegram,
  faFacebook,
  faFacebookMessenger,
  faDiscord,
  faLine,
  faTelegramPlane,
  faWhatsapp,
  faPinterest,
  faMedium,
  faAngleLeft,
  faAngleRight,
  faReply,
  faThumbsUp,
  faUserCircle,
  faThumbsDown,
  faExternalLinkSquareAlt,
  faYoutube,
  faInstagram,
  faX
)

<<<<<<< HEAD:plugins/icons.client.ts
FontAwesomeIcon.use(Neo, {
  iconPack: 'fa-sharp',
  customIconPacks: {
    'fa-sharp': {
      iconPrefix: 'fa-',
      sizes: {
        default: 'fw fa-regular',
      },
    },
  },
=======
// nuxt will handle css
config.autoAddCss = false

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon).use(Neo, {
    iconComponent: 'font-awesome-icon',
    iconPack: 'fas',
    // iconPack: 'fa-sharp',
    // customIconPacks: {
    //   'fa-sharp': {
    //     iconPrefix: 'fa-',
    //     sizes: {
    //       default: 'fw fa-regular',
    //     },
    //   },
    // },
  })
>>>>>>> nuxt:plugins/icons.ts
})

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('VueFontAwesome', FontAwesomeIcon)
})
