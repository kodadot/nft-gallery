import { Component, Vue, Watch } from 'nuxt-property-decorator'
import { showNotification } from '@/utils/notification'

export const enum CreateComponent {
  Collection = 'Collection',
  NFT = 'NFT',
}

@Component
export default class CreateMixin extends Vue {
  public activeTab = 0

  public components: CreateComponent[] = [
    CreateComponent.Collection,
    CreateComponent.NFT,
  ]

  switchToCreateNFT() {
    const targetIdx = this.components.findIndex(
      (componentName) => componentName === CreateComponent.NFT
    )
    const delaySwitchFn = () =>
      (this.activeTab = targetIdx > -1 ? targetIdx : 0)
    showNotification('You will go to create nft in 2 seconds')
    setTimeout(delaySwitchFn, 2000)
  }
  @Watch('activeTab', { immediate: true })
  onTabChange(newTab: number) {
    const { replaceUrl } = useReplaceUrl()
    replaceUrl({
      tab: newTab === 1 ? CreateComponent.NFT : CreateComponent.Collection,
    })
  }
  created() {
    const route = useRoute()
    const tab = route.query.tab
    if (tab) {
      this.activeTab = tab === CreateComponent.NFT ? 1 : 0
    }
  }
}
