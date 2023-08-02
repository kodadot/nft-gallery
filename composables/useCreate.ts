import { showNotification } from '@/utils/notification'

export const enum CreateComponent {
  Collection = 'Collection',
  NFT = 'NFT',
}

export default function useCreate() {
  const showExplainerText = ref(false)
  const { replaceUrl } = useReplaceUrl()
  const route = useRoute()
  const components = [CreateComponent.Collection, CreateComponent.NFT]
  const activeTab = computed({
    get: () => (route.query.tab === CreateComponent.NFT ? 2 : 1),
    set: (value) =>
      replaceUrl({
        tab: value === 2 ? CreateComponent.NFT : CreateComponent.Collection,
      }),
  })

  const switchToNft = () => {
    showNotification('You will go to create nft in 2 seconds')
    setTimeout(() => replaceUrl({ tab: CreateComponent.NFT }), 2000)
    showExplainerText.value = true
  }

  watch(activeTab, (newTab: number) => {
    replaceUrl({
      tab: newTab === 2 ? CreateComponent.NFT : CreateComponent.Collection,
    })
  })

  return {
    activeTab,
    showExplainerText,
    components,
    switchToNft,
  }
}
