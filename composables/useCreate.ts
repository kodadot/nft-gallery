import { showNotification } from '@/utils/notification'

export const enum CreateComponent {
  Collection = 'Collection',
  NFT = 'NFT',
}

export default function useCreate() {
  const activeTab = ref(0)
  const showExplainerText = ref(false)
  const { replaceUrl } = useReplaceUrl()
  const route = useRoute()

  const components = [CreateComponent.Collection, CreateComponent.NFT]

  const switchToNft = () => {
    const targetIdx = components.findIndex(
      (componentName) => componentName === CreateComponent.NFT
    )
    const delaySwitchFn = () =>
      (activeTab.value = targetIdx > -1 ? targetIdx : 0)
    showNotification('You will go to create nft in 2 seconds')
    setTimeout(delaySwitchFn, 2000)
    showExplainerText.value = true
  }

  watch(activeTab, (newTab: number) => {
    replaceUrl({
      tab: newTab === 2 ? CreateComponent.NFT : CreateComponent.Collection,
    })
  })

  onMounted(() => {
    const tab = route.query.tab
    if (tab) {
      activeTab.value = tab === CreateComponent.NFT ? 2 : 1
    }
  })

  return {
    activeTab,
    showExplainerText,
    components,
    switchToNft,
  }
}
