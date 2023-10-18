import RedirectModal from './RedirectModal.vue'
import { EXTERNAL_LINK_WHITELIST } from '@/utils/constants'
import VueI18n from 'vue-i18n/types'
import {
  convertSingularCollectionUrlToKodadotUrl,
  isExternal,
} from '@/utils/url'
import { useEventListener } from '@vueuse/core'
import type { Ref } from 'vue/types'

function isWhiteList(url: string) {
  const urlObj = new URL(url)
  const redirectHost = urlObj.host.toLocaleLowerCase()
  return EXTERNAL_LINK_WHITELIST.some((link) => {
    // fuzzy matching
    if (link.startsWith('*')) {
      return (
        // match ".kodadot.xyz", prevent match "fakekodadot.xyz"
        redirectHost.endsWith(link.substring(1)) ||
        // match kodadot.xyz
        redirectHost === link.substring(2)
      )
    } else {
      return redirectHost === link
    }
  })
}

const showModal = (url: string, i18n: VueI18n, modal) => {
  modal.open({
    component: RedirectModal,
    canCancel: ['outside', 'escape'],
    rootClass: 'redirect-modal neo-modal',
    props: {
      url,
      i18n,
    },
  })
}

export const useRedirectModal = (element: Ref<HTMLElement | null>) => {
  const { neoModal } = useProgrammatic()
  const { $i18n } = useNuxtApp()

  const handleLink = (event: Event) => {
    let ele = event.target as HTMLLinkElement
    // to handle elements wrapped by <a>
    ele = (ele.closest('a') as unknown as HTMLLinkElement) ?? ele
    event.stopPropagation()
    event.preventDefault()
    const href = convertSingularCollectionUrlToKodadotUrl(ele.href)

    if (href && isExternal(href) && !isWhiteList(href)) {
      showModal(href, $i18n, neoModal)
    } else if (href) {
      if (process.client) {
        window.open(href, '_blank')
      }
    }
  }

  useEventListener(element, 'click', handleLink)
}

export default useRedirectModal
