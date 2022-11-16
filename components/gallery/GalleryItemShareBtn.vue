<template>
  <div>
    <b-dropdown aria-role="list" position="is-bottom-left">
      <template #trigger>
        <NeoButton label="Share" icon="share-square" />
      </template>

      <b-dropdown-item
        v-clipboard:copy="realworldFullPathShare"
        aria-role="listitem"
        @click="toast($t('toast.urlCopy'))">
        Copy Link
      </b-dropdown-item>
      <b-dropdown-item aria-role="listitem" @click="isModalActive = true">
        QR Code
      </b-dropdown-item>
      <b-dropdown-item aria-role="listitem" has-link>
        <a :href="twitterUri" target="_blank"> Share On Twitter </a>
      </b-dropdown-item>
    </b-dropdown>

    <b-modal v-model="isModalActive">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">QR Code</p>
        </header>
        <div class="card-content">
          <QRCode
            :text="realworldFullPathShare"
            color="#db2980"
            bg-color="#000" />
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'

const QRCode = () => import('@/components/shared/QRCode.vue')

const route = useRoute()
const { $buefy } = useNuxtApp()

const isModalActive = ref(false)
// TODO: sharingTxt = $t('sharing.nft')
const sharingTxt = ref('Check out this awesome NFT on Kodadot ')
const realworldFullPathShare = ref(`${window.location.origin}${route.fullPath}`)
const twitterUri = ref(
  `https://twitter.com/intent/tweet?text=${sharingTxt.value}&via=KodaDot&url=${realworldFullPathShare.value}`
)
const toast = (message: string): void => {
  console.log(twitterUri)
  $buefy.toast.open(message)
}
</script>
