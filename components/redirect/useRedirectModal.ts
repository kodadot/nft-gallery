import RedirectModal from './RedirectModal.vue'
import { EXTERNAL_LINK_WHITELIST } from '@/utils/constants'
import { ModalProgrammatic as Modal } from 'buefy'
import { BModalConfig } from 'buefy/types/components'

function isExternal(url: string) {
  return !url.startsWith(window.location.origin)
}

function isWhiteList(url: string) {
  const urlObj = new URL(url)
  const redirectHost = urlObj.host.toLocaleLowerCase()
  return EXTERNAL_LINK_WHITELIST.includes(redirectHost)
}

export const useRedirectModal = (target: string) => {
  const { $i18n } = useNuxtApp()
  const _dom = document.querySelector(target) || document.body
  const handleLink = (event: Event) => {
    let target = event.target as HTMLLinkElement
    if (target.closest('a') !== null) {
      // to handle elements wrapped by <a>
      target = target.closest('a') as unknown as HTMLLinkElement
    }
    if (target.href && isExternal(target.href) && !isWhiteList(target.href)) {
      event.stopPropagation()
      event.preventDefault()
      showModal(target.href)
    }
  }
  const showModal = (url: string) => {
    Modal.open({
      component: RedirectModal,
      canCancel: true,
      customClass: 'redirect-modal',
      props: {
        url,
        i18n: $i18n,
      },
    } as unknown as BModalConfig)
  }

  onMounted(() => {
    _dom.addEventListener('click', handleLink)
  })
  onBeforeUnmount(() => {
    _dom.removeEventListener('click', handleLink)
  })
}
