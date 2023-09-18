<template>
  <div>
    <div class="is-flex is-justify-content-space-between">
      <div class="is-flex pr-2">
        <div>
          <BasicImage
            :src="avatar"
            :alt="nft.name"
            class="border image is-48x48" />
        </div>
        <div
          class="is-flex is-flex-direction-column is-justify-content-space-between ml-4 limit-width">
          <div class="has-text-color line-height-1 no-wrap is-clipped ellipsis">
            {{ nft.name }}
          </div>
          <div class="line-height-1 no-wrap k-grey is-clipped ellipsis">
            {{ label }}:
          </div>
        </div>
      </div>
      <div class="is-flex is-align-items-end no-wrap k-grey line-height-1">
        <template v-if="isNFT">
          <template v-if="showPrice">
            <CommonTokenMoney :value="price" />
          </template>
          <template v-else> Not Listed </template>
        </template>
        <template v-else>
          {{ blockchain.text }}
        </template>
      </div>
    </div>
    <div v-if="isNFT" class="is-flex mt-4 is-align-items-center">
      <div class="k-grey mr-2">{{ $t('mint.nft.modal.intoCollection') }}</div>
      <NeoIcon pack="fa-sharp" icon="arrow-right-long" class="k-grey mr-4" />
      <div>{{ nft.selectedCollection.name }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BasicImage from '@/components/shared/view/BasicImage.vue'
import { ExtendedInformation } from './MintConfirmModal.vue'
import { NeoIcon } from '@kodadot1/brick'
import { CreateComponent } from '@/composables/useCreate'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'

const { $i18n } = useNuxtApp()

const props = defineProps<{ nft: ExtendedInformation }>()
const avatar = ref<string>()

const isNFT = computed(() => props.nft.mintType === CreateComponent.NFT)
const label = computed(() =>
  isNFT.value
    ? $i18n.t('mint.nft.modal.price')
    : $i18n.t('mint.nft.modal.network')
)
const price = computed(() => props.nft.price)
const showPrice = computed(() => props.nft.listForSale)
const blockchain = computed(() => props.nft.blockchain)
watch(
  () => props.nft.file,
  () => {
    const file = props.nft.file
    const reader = new FileReader()
    avatar.value = URL.createObjectURL(file)
    reader.readAsText(file)
  },
  {
    immediate: true,
  }
)
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';

.limit-width {
  max-width: 170px;
}

.ellipsis {
  text-overflow: ellipsis;
}

.line-height-1 {
  line-height: 1;
}

.k-grey {
  @include ktheme() {
    color: theme('k-grey');
  }
}
</style>
