import RedirectModal from './RedirectModal.vue'
import { EXTERNAL_LINK_WHITELIST } from '@/utils/constants'
import { ModalProgrammatic as Modal } from 'buefy'
import { BModalConfig } from 'buefy/types/components'
import VueI18n from 'vue-i18n/types'

function isExternal(url: string) {
  return !url.startsWith(window.location.origin)
}

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

const showModal = (url: string, i18n: VueI18n) => {
  Modal.open({
    component: RedirectModal,
    canCancel: ['outside', 'escape'],
    customClass: 'redirect-modal',
    props: {
      url,
      i18n,
    },
  } as unknown as BModalConfig)
}

export const useRedirectModal = (target: string) => {
  const { $i18n } = useNuxtApp()
  const _dom = document.querySelector(target) || document.body

  const handleLink = (event: Event) => {
    let ele = event.target as HTMLLinkElement
    // to handle elements wrapped by <a>
    ele = (ele.closest('a') as unknown as HTMLLinkElement) ?? ele
    if (ele.href && isExternal(ele.href) && !isWhiteList(ele.href)) {
      event.stopPropagation()
      event.preventDefault()
      showModal(ele.href, $i18n)
    }
  }

  onMounted(() => {
    _dom.addEventListener('click', handleLink)
  })
  onBeforeUnmount(() => {
    _dom.removeEventListener('click', handleLink)
  })
}
