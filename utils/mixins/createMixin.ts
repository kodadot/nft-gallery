import { Component, Vue } from 'nuxt-property-decorator'

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
    this.activeTab = targetIdx > -1 ? targetIdx : 0
  }
}
