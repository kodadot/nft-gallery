<template>
    <div class="pack-item-wrapper container">
    <div class="columns is-centered">
      <div class="column is-half has-text-centered">
        <div class="container image is-128x128 mb-2">
          <b-image
            v-if="!isLoading"
            :src="image"
            :alt="name"
            ratio="1by1"
            rounded
          ></b-image>
        </div>
        <h1 class="title is-2">
          {{ name }}
        </h1>
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <div class="label">
          {{ $t('creator') }}
        </div>
        <div class="subtitle is-size-6">
          <ProfileLink :address="issuer" :inline="true" :showTwitter="true"/>
        </div>
      </div>
      <div class="column" v-if="owner">
        <div class="label">
          {{ $t('owner') }}
        </div>
        <div class="subtitle">
          <ProfileLink :address="owner" :inline="true" />
        </div>
      </div>
      <div class="column is-2">
        <Sharing v-if="sharingVisible"
          label="Check this awesome Collection on %23KusamaNetwork %23KodaDot"
          :iframe="iframeSettings" >
          <TransferCollection v-if="accountIsCurrentOwner" :collectionId="id" :currentOwnerId="currentOwner" :accountId="accountId" />
        </Sharing>
      </div>
    </div>

    <div class="columns is-centered">
      <div class="column is-8 has-text-centered">
        <p class="content">
          <VueMarkdown :source="description" />
          <CollapseWrapper v-if="attributes && attributes.length" visible="collapse.collection.attributes.show" hidden="collapse.collection.attributes.hide">
            <div v-for="(attr, index) in attributes" :key="index">
              <span class="text-bold">{{ attr.key }}: </span><span>{{ attr.value }}</span>
            </div>
          </CollapseWrapper>
        </p>
      </div>
    </div>

    <GalleryCardList
      :items="nfts"
      :link="`${urlPrefix}/gallery`"
      :route="`/${urlPrefix}/gallery`"
      :collection="id"
      :formatId="formater"
      class="mb-2"
    />
  </div>
</template>

<script lang="ts" >
import { emptyObject } from '@/utils/empty'
import { notificationTypes, showNotification } from '@/utils/notification'
import { Component, Vue } from 'vue-property-decorator'
import { fetchCollectionMetadata, sanitizeIpfsUrl } from '@/components/rmrk/utils'
import isShareMode from '@/utils/isShareMode'

import Connector from '@vue-polkadot/vue-api'
import { Option } from '@polkadot/types'
import { NFTWithMeta } from '@/components/rmrk/service/scheme'
import { ClassDetails, ClassMetadata } from '@polkadot/types/interfaces'
import collectionById from '@/queries/unique/collectionById.graphql'
import { CollectionMetadata } from '@/components/rmrk/service/scheme'
import { createTokenId, tokenIdToRoute } from '../../utils'
import { Collection, Attribute } from '@/components/unique/types'
import AuthMixin from '@/utils/mixins/authMixin'
import { mixins } from 'vue-class-component'
import onApiConnect from '~/utils/api/general'
import SubscribeMixin from '~/utils/mixins/subscribeMixin'
import PrefixMixin from '~/utils/mixins/prefixMixin'

const components = {
  GalleryCardList: () => import('@/components/rmrk/Gallery/GalleryCardList.vue'),
  Sharing: () => import('@/components/rmrk/Gallery/Item/Sharing.vue'),
  ProfileLink: () => import('@/components/rmrk/Profile/ProfileLink.vue'),
  VueMarkdown: () => import('vue-markdown-render'),
  CollapseWrapper: () => import('@/components/shared/collapse/CollapseWrapper.vue'),
  TransferCollection: () => import('@/components/unique/Collection/Item/TransferCollectionModal.vue'),
}

@Component<CollectionItem>({
  components
})
export default class CollectionItem extends mixins(AuthMixin, SubscribeMixin, PrefixMixin) {
  private id = ''
  private collection: Collection & CollectionMetadata = emptyObject()
  private attributes: Attribute[] = []
  private nfts: NFTWithMeta[] = []
  private isLoading = false
  private formater = tokenIdToRoute

  get image() {
    return  sanitizeIpfsUrl(this.collection.image || '') || '/koda300x300.svg'
  }

  get description() {
    return this.collection.description || ''
  }

  get name() {
    return (this.collection as any).name || this.id
  }

  get issuer() {
    return this.collection.issuer || ''
  }

  get currentOwner() {
    return this.owner || this.issuer
  }

  get owner() {
    return this.collection.issuer === (this.collection as any).currentOwner ? '' : (this.collection as any).currentOwner
  }

  get accountIsCurrentOwner() {
    return this.accountId === this.currentOwner
  }

  get sharingVisible() {
    return !isShareMode
  }

  get hasAttributes() {
    return this.collection.attributes && this.collection.attributes.length > 0
  }

  public created() {
    this.checkId()
    this.fetchCollection()
    onApiConnect(api => {
      this.loadMagic()
      this.subscribe(api.query.uniques.class, [this.id], this.observeOwner)
    })
  }

  protected observeOwner(data: Option<ClassDetails>) {
    console.log(data.toHuman())
    const instance = data.unwrapOr(null)
    if (instance) {
      this.$set(this.collection, 'currentOwner', instance.owner.toHuman())
      this.$set(this.collection, 'issuer', instance.issuer.toHuman())
      this.$set(this.collection, 'isFrozen', instance.isFrozen.isTrue)
    } else {
      showNotification(`Collection ${this.id} not found on chain`, notificationTypes.danger)
    }
  }

  private async fetchCollection() {
    const nfts = this.$apollo.query({
      query: collectionById,
      client: this.urlPrefix,
      variables: {
        id: this.id
      }
    })

    const {
      data: {
        collectionEntity: {
          nfts: { nodes: nftList },
          ...col
        }
      }
    } = await nfts

    this.attributes = [...col.attributes || []]

    this.collection = {
      ...this.collection,
      ...col
    }

    this.nfts = nftList
  }

  public async loadMagic() {
    const { api } = Connector.getInstance()
    await api?.isReady

    try {
      const collectionQ = await api.query.uniques
        .classMetadataOf<Option<ClassMetadata>>(this.id)
        .then(res => res.unwrapOr(null))

      if (!collectionQ) {
        showNotification(
          `No Metadata for collection ID ${this.id}`,
          notificationTypes.warn
        )
        return
      }

      const collectionData = collectionQ.toHuman()

      if (!collectionData.data) {
        showNotification(
          `No Metadata with ID ${this.id}`,
          notificationTypes.info
        )
        // return;
        // not a handicap tho
      }

      const collection = await fetchCollectionMetadata({
        metadata: collectionData?.data?.toString()
      } as any)

      this.collection = {
        ...this.collection,
        ...collection,
        attributes: []
      }
    } catch (e) {
      showNotification(`${e}`, notificationTypes.warn)
      console.warn(e)
    }

    this.isLoading = false
  }

  public checkId() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id
    }
  }

  get iframeSettings() {
    return { width: '100%', height: '100vh' }
  }
}
</script>
