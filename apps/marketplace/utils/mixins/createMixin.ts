import { Component, Vue } from 'nuxt-property-decorator'
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
}
