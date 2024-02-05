<template>
  <div>
    <div class="hero-buttons flex justify-end items-end px-2">
      <div v-if="twitter" class="flex">
        <NeoButton
          icon="x-twitter"
          icon-pack="fab"
          class="square-32"
          @click="openUrl(`https://twitter.com/${twitter}`)" />
      </div>

      <div
        v-if="displaySeperator"
        class="vertical-seperator mx-4 is-hidden-mobile" />

      <div class="flex">
        <NeoDropdown
          position="bottom-left"
          append-to-body
          :mobile-modal="false">
          <template #trigger="{ active }">
            <NeoButton
              icon="share-alt"
              class="square-32 mr-3"
              data-testid="share-button"
              :active="active" />
          </template>

          <NeoDropdownItem
            v-clipboard:copy="currentCollectionUrl"
            data-testid="hero-copy-link-dropdown"
            @click="toast($t('toast.urlCopy'))">
            {{ $i18n.t('share.copyLink') }}
          </NeoDropdownItem>
          <NeoDropdownItem
            data-testid="hero-share-QR-dropdown"
            @click="QRModalActive = true">
            {{ $i18n.t('share.qrCode') }}
          </NeoDropdownItem>
          <NeoDropdownItem
            data-testid="hero-share-twitter-dropdown"
            @click="shareUrlToX">
            {{ $i18n.t('share.twitter') }}
          </NeoDropdownItem>
        </NeoDropdown>

        <NeoDropdown
          position="bottom-left"
          append-to-body
          :mobile-modal="false">
          <template #trigger="{ active }">
            <NeoButton
              icon="ellipsis-vertical"
              class="square-32"
              data-testid="more-actions-button"
              :active="active" />
          </template>

          <!-- related: #5792 -->
          <div v-if="isOwner">
            <CollectionHeroButtonAddNfts />
            <CollectionHeroButtonDeleteNfts />
            <CollectionHeroButtonDeleteCollection />
            <CollectionHeroButtonCustomizeCollection
              :min="collectionNftCount"
              :max="collectionMaxCount" />
          </div>
          <NeoDropdownItem disabled>
            {{ $i18n.t('moreActions.reportCollection') }}
          </NeoDropdownItem>
        </NeoDropdown>
      </div>
    </div>
    <NeoModal :value="QRModalActive" @close="QRModalActive = false">
      <div class="card" data-testid="hero-share-qrcode-modal">
        <header class="card-header">
          <p class="card-header-title">{{ collection?.name }}</p>
        </header>
        <div class="card-content">
          <QRCode :text="currentCollectionUrl" />
        </div>
      </div>
    </NeoModal>
  </div>
</template>

<script setup lang="ts">
import {
  NeoButton,
  NeoDropdown,
  NeoDropdownItem,
  NeoModal,
} from '@kodadot1/brick'
import { useCollectionMinimal } from '@/components/collection/utils/useCollectionDetails'

const route = useRoute()
const { isCurrentOwner } = useAuth()
const { urlPrefix } = usePrefix()
const { $i18n } = useNuxtApp()
const { toast } = useToast()
const { shareOnX } = useSocialShare()

const collectionId = computed(() => route.params.id.toString())
const currentCollectionUrl = computed(
  () =>
    `${window.location.origin}/${urlPrefix.value}/collection/${collectionId.value}`,
)

const shareUrlToX = () => {
  shareOnX(
    `${$i18n.t('sharing.collection')} ${
      currentCollectionUrl.value
    } \n#Polkadot @polkadot`,
    '',
  )
}
const { collection } = useCollectionMinimal({
  collectionId,
})
const collectionIssuer = computed(() => collection.value?.issuer)
const collectionNftCount = computed(() => collection.value?.nftCount)
const collectionMaxCount = computed(() => collection.value?.max)

const { twitter } = useIdentity({
  address: collectionIssuer,
})

const openUrl = (url: string) => {
  window.open(url, '_blank')
}

const displaySeperator = computed(() => twitter.value)
const isOwner = computed(() => isCurrentOwner(collection.value?.currentOwner))

const QRModalActive = ref(false)
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';
@include mobile {
  .hero-buttons {
    margin-top: 0;
    margin-bottom: 1.5rem;
  }
}
.square-32 {
  width: 32px;
  height: 32px;
}
.vertical-seperator {
  height: 24px;
  margin-bottom: 4px;
  width: 1px;
  @include ktheme() {
    background-color: theme('border-color');
  }
}
</style>
