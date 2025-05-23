<template>
  <div>
    <div class="flex justify-between">
      <div class="flex pr-2">
        <div>
          <BasicImage
            :src="avatar"
            :alt="nft.name"
            class="border image size-12"
          />
        </div>
        <div class="flex flex-col justify-between ml-4 w-[100px] md:w-[170px]">
          <div
            class="text-text-color leading-none whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {{ nft.name }}
          </div>
          <div
            class="leading-none whitespace-nowrap text-k-grey overflow-hidden text-ellipsis"
          >
            {{ label }}:
          </div>
        </div>
      </div>
      <div class="flex items-end whitespace-nowrap text-k-grey leading-none">
        <template v-if="isNFT">
          <template v-if="showPrice">
            <CommonTokenMoney :value="price" />
          </template>
          <template v-else>
            Not Listed
          </template>
        </template>
        <template v-else>
          {{ blockchain.text }}
        </template>
      </div>
    </div>
    <div
      v-if="isNFT"
      class="flex mt-4 items-center"
    >
      <div class="text-k-grey mr-2">
        {{ $t('mint.nft.modal.intoCollection') }}
      </div>
      <KIcon
        name="i-mdi:arrow-right"
        class="text-k-grey mr-4"
      />
      <div>{{ nft.selectedCollection?.name }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ExtendedInformation } from './MintConfirmModal.vue'
import BasicImage from '@/components/shared/view/BasicImage.vue'
import { CreateComponent } from '@/composables/useCreate'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'

const { $i18n } = useNuxtApp()

const props = defineProps<{ nft: ExtendedInformation }>()
const avatar = ref<string>()

const isNFT = computed(() => props.nft.mintType === CreateComponent.NFT)
const label = computed(() =>
  isNFT.value
    ? $i18n.t('mint.nft.modal.price')
    : $i18n.t('mint.nft.modal.network'),
)
const price = computed(() => props.nft.price)
const showPrice = computed(() => props.nft.listForSale)
const blockchain = computed(() => props.nft.blockchain)

watchEffect(() => {
  const file = props.nft.file
  if (file) {
    const reader = new FileReader()
    avatar.value = URL.createObjectURL(file)
    reader.readAsText(file)
  }
})
</script>
