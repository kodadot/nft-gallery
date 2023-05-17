import RedirectModal from './RedirectModal.vue'
import { EXTERNAL_LINK_WHITELIST } from '@/utils/constants'
import { ModalProgrammatic as Modal } from 'buefy'
import { BModalConfig } from 'buefy/types/components'
import VueI18n from 'vue-i18n/types'
import {
  convertSingularCollectionUrlToKodadotUrl,
  isExternal,
} from '@/utils/url'

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
  const _dom = computed(() => document.querySelector(target) || document.body)

  const handleLink = (event: Event) => {
    let ele = event.target as HTMLLinkElement
    // to handle elements wrapped by <a>
    ele = (ele.closest('a') as unknown as HTMLLinkElement) ?? ele
    event.stopPropagation()
    event.preventDefault()
    const href = convertSingularCollectionUrlToKodadotUrl(ele.href)

    if (href && isExternal(href) && !isWhiteList(href)) {
      showModal(href, $i18n)
    } else {
      window.open(href, '_blank')
    }
  }

  onMounted(() => {
    _dom.value.addEventListener('click', handleLink)
  })
  onBeforeUnmount(() => {
    _dom.value.removeEventListener('click', handleLink)
  })
}

export default useRedirectModal
