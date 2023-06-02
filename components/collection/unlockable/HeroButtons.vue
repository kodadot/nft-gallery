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
          <NeoButton
            icon="share-alt"
            class="square-32 mr-3"
            data-cy="share-button" />
          <template #items>
            <NeoDropdownItem
              v-clipboard:copy="currentUrl"
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
                :url="currentUrl"
                :title="sharingLabel"
                twitter-user="KodaDot">
                {{ $i18n.t('share.twitter') }}
              </ShareNetwork>
            </NeoDropdownItem>
          </template>
        </NeoDropdown>
      </div>
    </div>
    <NeoModal v-model="QRModalActive" @close="QRModalActive = false">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">{{ collection?.name }}</p>
        </header>
        <div class="card-content">
          <QRCode :text="currentUrl" color="#db2980" bg-color="#000" />
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

const { $i18n, $buefy } = useNuxtApp()
const currentUrl = computed(() => window.location.href)

const openUrl = (url: string) => {
  window.open(url, '_blank')
}

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
