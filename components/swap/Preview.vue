<template>
  <div class="border bg-background-color shadow-primary pb-6 w-full h-min md:w-[444px] lg:w-[490px] relative">
    <div class="px-6 py-4 flex justify-between border-b items-center">
      <div class="text-base font-bold line-height">
        {{ title }}
      </div>
    </div>

    <div class="p-6 min-h-[50vh] overflow-y-auto">
      <div class="flex justify-between items-center">
        <span>
          {{ items.length }} {{ $t('items') }}
        </span>

        <a
          v-if="items.length"
          @click="emit('clear')"
        >
          {{ $t('shoppingCart.clearAll') }}
        </a>
      </div>

      <hr class="!my-6">

      <div
        ref="itemsContainer"
        class="flex flex-col gap-3 max-h-[300px] overflow-y-auto"
      >
        <div
          v-for="nft in items"
          :key="nft.id"
          class="flex justify-between"
        >
          <div
            class="flex gap-4 items-center"
          >
            <BaseMediaItem
              class="border border-k-shade image is-48x48"
              :alt="nft.name"
              :src="sanitizeIpfsUrl(nft.meta.image)"
              preview
              is-detail
            />

            <span>
              {{ nft.name }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="pb-4 px-6">
      <div class="flex gap-4">
        <NeoButton
          size="large"
          label="Back"
          variant="text"
          no-shadow
          expanded
          @click="router.back()"
        />
        <NeoButton
          size="large"
          label="Next"
          variant="primary"
          no-shadow
          expanded
          @click="emit('next')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { sanitizeIpfsUrl } from '@/utils/ipfs'

const emit = defineEmits(['next', 'clear'])
const props = defineProps<{
  title: string
  items: any[]
}>()

const itemsContainer = ref()

const router = useRouter()

watch(() => props.items.length, () => {
  nextTick().then(() => {
    // scroll to bottom
    itemsContainer.value.scrollTo({
      top: itemsContainer.value.scrollHeight,
      behavior: 'smooth',
    })
  })
})
</script>
