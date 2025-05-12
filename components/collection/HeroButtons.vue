<template>
  <div>
    <div class="max-md:mt-0 max-md:mb-6 flex justify-end items-end px-2">
      <div
        v-if="twitter"
        class="flex"
      >
        <NeoButton
          icon="x-twitter"
          icon-pack="fab"
          class="size-8"
          @click="openUrl(`https://twitter.com/${twitter}`)"
        />
      </div>

      <div
        v-if="displaySeperator"
        class="bg-border-color h-5 mb-1 w-px mx-4 is-hidden-mobile"
      />

      <div class="flex">
        <NeoDropdown
          position="bottom-left"
          append-to-body
          menu-class="w-fit"
          :mobile-modal="false"
        >
          <template #trigger="{ active }">
            <NeoButton
              icon="share-alt"
              class="size-8 mr-3"
              data-testid="share-button"
              :active="active"
            />
          </template>

          <NeoDropdownItem
            v-clipboard:copy="currentCollectionUrl"
            class="w-max flex! items-center"
            @click="shareCollectionToFarcaster"
          >
            <KIcon
              name="i-mdi:vector-square"
              class="mr-2"
            />
            {{ $i18n.t('share.farcasterFrame') }}
          </NeoDropdownItem>
          <NeoDropdownItem
            v-clipboard:copy="currentCollectionUrl"
            data-testid="hero-copy-link-dropdown"
            class="flex! items-center"
            @click="toast($t('toast.urlCopy'))"
          >
            <KIcon
              name="i-mdi:link"
              class="mr-2"
            />
            {{ $i18n.t('share.copyLink') }}
          </NeoDropdownItem>
          <NeoDropdownItem
            data-testid="hero-share-QR-dropdown"
            class="flex! items-center"
            @click="QRModalActive = true"
          >
            <KIcon
              name="i-mdi:qrcode"
              class="mr-2"
            />
            {{ $i18n.t('share.qrCode') }}
          </NeoDropdownItem>
          <NeoDropdownItem
            data-testid="hero-share-twitter-dropdown"
            class="flex! items-center"
            @click="shareUrlToX"
          >
            <KIcon
              name="i-mdi:share"
              class="mr-2"
            />
            {{ $i18n.t('share.twitter') }}
          </NeoDropdownItem>
        </NeoDropdown>

        <NeoDropdown
          position="bottom-left"
          append-to-body
          :mobile-modal="false"
        >
          <template #trigger="{ active }">
            <NeoButton
              icon="ellipsis-vertical"
              class="size-8"
              data-testid="more-actions-button"
              :active="active"
            />
          </template>

          <!-- related: #5792 -->
          <div v-if="isOwner && !hasOperationsDisabled(urlPrefix)">
            <CollectionHeroButtonAddNfts />
            <CollectionHeroButtonDeleteNfts :collection="collection" />
            <CollectionHeroButtonDeleteCollection :collection="collection" />
            <CollectionHeroButtonEditCollection :collection="collection" />
          </div>
          <CollectionHeroButtonRefreshMetadata v-if="isOwner" />
          <NeoDropdownItem disabled>
            {{ $i18n.t('moreActions.reportCollection') }}
          </NeoDropdownItem>
        </NeoDropdown>
      </div>
    </div>
    <UModal
      v-model:open="QRModalActive"
      :title="collection?.name"
    >
      <template #body>
        <div
          class="card-content"
          data-testid="hero-share-qrcode-modal"
        >
          <QRCode
            :text="currentCollectionUrl"
            class="w-full h-full"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import {
  NeoButton,
  NeoDropdown,
  NeoDropdownItem,
} from '@kodadot1/brick'
import { useCollectionMinimal } from '@/components/collection/utils/useCollectionDetails'
import { hasOperationsDisabled } from '@/utils/prefix'

const route = useRoute()
const { isCurrentAccount } = useAuth()
const { urlPrefix } = usePrefix()
const { $i18n } = useNuxtApp()
const { toast } = useToastOruga()
const { shareOnX, shareCollectionOnFarcaster } = useSocialShare()

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
const shareCollectionToFarcaster = () => {
  shareCollectionOnFarcaster(
    urlPrefix.value,
    collectionId.value,
    `${$i18n.t('sharing.collection')} ${currentCollectionUrl.value}`,
  )
}

const { collection } = useCollectionMinimal({
  collectionId,
})
const collectionIssuer = computed(() => collection.value?.displayCreator)

const { twitter } = useIdentity({
  address: collectionIssuer,
})

const openUrl = (url: string) => {
  window.open(url, '_blank')
}

const displaySeperator = computed(() => twitter.value)
const isOwner = computed(() => isCurrentAccount(collection.value?.currentOwner))

const QRModalActive = ref(false)
</script>
