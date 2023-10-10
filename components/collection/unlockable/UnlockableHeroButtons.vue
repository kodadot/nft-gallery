<template>
  <div>
    <div
      class="hero-buttons is-flex is-justify-content-flex-start is-align-items-end px-2">
      <div class="is-flex">
        <NeoDropdown position="bottom-left" :mobile-modal="false">
          <template #trigger="{ active }">
            <NeoButton
              icon="share-alt"
              class="square-32 mr-3"
              data-testid="share-button"
              :active="active" />
          </template>

          <NeoDropdownItem
            v-clipboard:copy="currentUrl"
            @click="toast(`${$t('toast.urlCopy')}`)">
            {{ $t('share.copyLink') }}
          </NeoDropdownItem>
          <NeoDropdownItem @click="QRModalActive = true">
            {{ $t('share.qrCode') }}
          </NeoDropdownItem>
          <NeoDropdownItem>
            <ShareNetwork
              tag="div"
              network="twitter"
              :hashtags="hashtags"
              :url="currentUrl"
              :title="sharingLabel"
              twitter-user="KodaDot">
              {{ $t('share.twitter') }}
            </ShareNetwork>
          </NeoDropdownItem>
        </NeoDropdown>
      </div>
    </div>
    <NeoModal :value="QRModalActive" @close="QRModalActive = false">
      <div class="card">
        <div class="card-content">
          <QRCode :text="currentUrl" />
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

const { $i18n } = useNuxtApp()
const currentUrl = computed(() => window.location.href)

const QRModalActive = ref(false)

const hashtags = 'KusamaNetwork,KodaDot'
const sharingLabel = $i18n.t('sharing.collection')

const { toast } = useToast()
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';
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
</style>
