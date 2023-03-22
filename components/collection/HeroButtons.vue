<template>
  <div>
    <div
      class="hero-buttons is-flex is-justify-content-flex-start is-align-items-end px-2">
      <div class="is-flex">
        <NeoButton
          v-if="twitter"
          icon="twitter"
          icon-pack="fab"
          class="square-32"
          @click.native="openUrl(`https://twitter.com/${twitter}`)" />

        <NeoButton
          v-if="instagram"
          icon="instagram"
          icon-pack="fab"
          class="square-32"
          @click.native="openUrl(`https://instagram.com/${instagram}`)" />

        <NeoButton
          v-if="discord"
          class="square-32"
          icon-pack="fab"
          icon="discord"
          @click.native="openUrl(`https://discord.com/users/${discord}`)" />
      </div>

      <div
        v-if="displaySeperator"
        class="vertical-seperator mx-4 is-hidden-mobile" />

      <div class="is-flex">
        <NeoDropdown append-to-body>
          <NeoButton icon="share-alt" class="square-32 mr-3" />
          <template #items>
            <NeoDropdownItem
              v-clipboard:copy="currentURL"
              @click.native="toast(`${$i18n.t('toast.urlCopy')}`)">
              {{ $i18n.t('share.copyLink') }}
            </NeoDropdownItem>
            <NeoDropdownItem @click.native="QRModalActive = true">
              {{ $i18n.t('share.qrCode') }}
            </NeoDropdownItem>
            <NeoDropdownItem>
              <ShareNetwork
                tag="div"
                network="twitter"
                :hashtags="hashtags"
                :url="currentURL"
                :title="sharingLabel"
                twitter-user="KodaDot">
                {{ $i18n.t('share.twitter') }}
              </ShareNetwork>
            </NeoDropdownItem>
          </template>
        </NeoDropdown>

        <NeoDropdown append-to-body>
          <NeoButton icon="ellipsis-vertical" class="square-32" />
          <template #items>
            <div v-if="isOwner">
              <NeoDropdownItem>
                {{ $i18n.t('moreActions.delete') }}
              </NeoDropdownItem>
              <NeoDropdownItem>
                {{ $i18n.t('moreActions.customize') }}
              </NeoDropdownItem>
            </div>
            <div v-else>
              <NeoDropdownItem>
                {{ $i18n.t('moreActions.reportNFT') }}
              </NeoDropdownItem>
              <NeoDropdownItem>
                <div class="is-flex">
                  {{ $i18n.t('moreActions.download') }}
                  <b-icon icon="download" class="pl-3" />
                </div>
              </NeoDropdownItem>
            </div>
          </template>
        </NeoDropdown>
      </div>
    </div>
    <b-modal v-model="QRModalActive">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">{{ collection?.name }}</p>
        </header>
        <div class="card-content">
          <QRCode :text="currentURL" color="#db2980" bg-color="#000" />
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoDropdown, NeoDropdownItem } from '@kodadot1/brick'
import { isOwner as checkOwner } from '@/utils/account'
import { useCollectionMinimal } from '@/components/collection/utils/useCollectionDetails'
import useIdentity from '@/components/identity/utils/useIdentity'

const route = useRoute()
const { accountId } = useAuth()
const { $i18n, $buefy } = useNuxtApp()
const collectionId = computed(() => route.params.id)
const currentURL = computed(() => window.location.href)
const { collection } = useCollectionMinimal({
  collectionId: collectionId.value,
})
const collectionIssuer = computed(() => collection.value?.issuer)

const { discord, twitter, instagram, whichIdentity } = useIdentity({
  address: collectionIssuer.value,
})

const openUrl = (url: string) => {
  window.open(url, '_blank')
}

watch(collectionIssuer, () => {
  whichIdentity(collectionIssuer.value)
})

const displaySeperator = computed(
  () => discord.value || twitter.value || instagram.value
)
const isOwner = computed(() =>
  checkOwner(collection.value?.currentOwner, accountId.value)
)

const QRModalActive = ref(false)

const hashtags = 'KusamaNetwork,KodaDot'
const sharingLabel = $i18n.t('sharing.collection')

const toast = (message: string) => {
  $buefy.toast.open({
    message,
    type: 'is-neo',
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';
.hero-buttons {
  @include mobile {
    justify-content: space-between !important;
    flex: 1;
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
