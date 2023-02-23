<template>
  <section>
    <div class="is-flex is-justify-content-flex-start is-align-items-end px-2">
      <NeoButton icon="twitter" icon-pack="fab" class="squere-32 mr-3" />
      <NeoButton icon="instagram" icon-pack="fab" class="squere-32 mr-3" />
      <NeoButton icon="discord" icon-pack="fab" class="squere-32" />
      <div class="vertical-seperator mx-4"></div>
      <NeoDropdown append-to-body fit-to-content>
        <NeoButton icon="share-alt" class="squere-32 mr-3" />
        <template #items>
          <div class="mw-11 is-flex is-flex-wrap-wrap px-1">
            <ShareNetwork
              tag="button"
              class="button share__button is-medium"
              network="twitter"
              :title="sharingLabel"
              :hashtags="hashtags"
              :url="realworldFullPath"
              twitter-user="KodaDot">
              <b-icon size="is-large" pack="fab" icon="twitter" />
            </ShareNetwork>
            <ShareNetwork
              tag="button"
              class="button share__button is-medium"
              network="telegram"
              :title="sharingLabel"
              :url="realworldFullPath">
              <b-icon size="is-large" pack="fab" icon="telegram" />
            </ShareNetwork>
            <ShareNetwork
              tag="button"
              class="button share__button is-medium"
              network="facebook"
              :title="sharingLabel"
              :hashtags="hashtags"
              :url="realworldFullPath">
              <b-icon size="is-large" pack="fab" icon="facebook" />
            </ShareNetwork>
            <ShareNetwork
              tag="button"
              class="button share__button is-medium"
              network="messenger"
              :title="sharingLabel"
              :url="realworldFullPath">
              <b-icon size="is-large" pack="fab" icon="facebook-messenger" />
            </ShareNetwork>
            <ShareNetwork
              tag="button"
              class="button share__button is-medium"
              network="whatsapp"
              :title="sharingLabel"
              :url="realworldFullPath">
              <b-icon size="is-large" pack="fab" icon="whatsapp" />
            </ShareNetwork>
            <ShareNetwork
              tag="button"
              class="button share__button is-medium"
              network="email"
              :title="sharingLabel"
              :url="realworldFullPath">
              <b-icon size="is-large" pack="fas" icon="envelope" />
            </ShareNetwork>
          </div>
        </template>
      </NeoDropdown>
      <NeoDropdown append-to-body>
        <NeoButton icon="ellipsis-v" class="squere-32" />
        <template #items>
          <div v-if="isOwner">
            <NeoDropdownItem> Delete </NeoDropdownItem>
            <NeoDropdownItem> Customize </NeoDropdownItem>
          </div>

          <NeoDropdownItem v-else> Report </NeoDropdownItem>
        </template>
      </NeoDropdown>
    </div>
  </section>
</template>

<script setup lang="ts">
import { NeoButton, NeoDropdown, NeoDropdownItem } from '@kodadot1/brick'
import { isOwner as checkOwner } from '@/utils/account'
import {
  CollectionEntityMinimal,
  useCollectionMinimal,
} from './utils/useCollectionDetails'
const route = useRoute()
const { accountId } = useAuth()
const { $i18n } = useNuxtApp()
const collection = ref<CollectionEntityMinimal>()
const collectionId = computed(() => route.params.id)
const realworldFullPath = computed(
  () => `${window.location.origin}${route.fullPath}`
)
const isOwner = computed(() =>
  checkOwner(collection.value?.currentOwner, accountId.value)
)
const hashtags = 'KusamaNetwork,KodaDot'
const sharingLabel = $i18n.t('sharing.collection')

const { collection: data } = useCollectionMinimal({
  collectionId: collectionId.value,
})

watch(data, () => {
  collection.value = data.value
})
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.squere-32 {
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
.mw-11 {
  min-width: 11rem;
}
</style>

<style lang="scss">
@import '@/styles/abstracts/variables';
.o-drop__menu {
  min-width: fit-content;
}
</style>
