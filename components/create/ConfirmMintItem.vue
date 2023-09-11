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
            Network:
          </div>
        </div>
      </div>
      <div class="is-flex is-align-items-end no-wrap k-grey line-height-1">
        {{ blockchain }}
      </div>
    </div>
    <div class="is-flex mt-4 is-align-items-center">
      <div class="k-grey mr-2">Into Collection</div>
      <NeoIcon pack="fa-sharp" icon="arrow-right-long" class="k-grey mr-4" />
      <div class="">{{ nft.selectedCollection.name }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BasicImage from '@/components/shared/view/BasicImage.vue'
import { NftInformation } from './MintConfirmModal.vue'
import { availablePrefixes } from '@/utils/chain'
import { NeoIcon } from '@kodadot1/brick'

const props = defineProps<{ nft: NftInformation }>()

const avatar = ref<string>()

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

const blockchain = computed(
  () =>
    availablePrefixes().filter((e) => e.value === props.nft.urlPrefix)[0]?.text
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
