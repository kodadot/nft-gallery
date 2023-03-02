<template>
  <div>
    <div class="is-flex is-justify-content-flex-start is-align-items-end px-2">
      <div class="is-hidden-mobile">
        <NeoButton icon="twitter" icon-pack="fab" class="square-32 mr-3" />
        <NeoButton icon="instagram" icon-pack="fab" class="square-32 mr-3" />
        <NeoButton icon="discord" icon-pack="fab" class="square-32" />
      </div>
      <div class="vertical-seperator mx-4 is-hidden-mobile" />

      <NeoDropdown
        append-to-body
        class="is-hidden-tablet"
        position="bottom-left">
        <NeoButton icon="arrow-up-right-from-square" class="square-32 mr-3" />
        <!-- Temporary until there will be a design -->
        <template #items>
          <NeoDropdownItem item="twitter" />
          <NeoDropdownItem item="instagram" />
          <NeoDropdownItem item="discord" />
        </template>
      </NeoDropdown>

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
        <NeoButton icon="ellipsis-v" class="square-32" />
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
import { useCollectionMinimal } from '../utils/useCollectionDetails'
const route = useRoute()
const { accountId } = useAuth()
const { $i18n, $buefy } = useNuxtApp()
const collectionId = computed(() => route.params.id)
const currentURL = computed(() => window.location.href)
const { collection } = useCollectionMinimal({
  collectionId: collectionId.value,
})
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
