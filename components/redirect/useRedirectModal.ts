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
  return EXTERNAL_LINK_WHITELIST.includes(redirectHost)
}

const showModal = (url: string, i18n: VueI18n) => {
  Modal.open({
    component: RedirectModal,
    canCancel: true,
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
    if (ele.closest('a') !== null) {
      // to handle elements wrapped by <a>
      ele = ele.closest('a') as unknown as HTMLLinkElement
    }
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
