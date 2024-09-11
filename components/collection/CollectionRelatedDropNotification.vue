<template>
  <div
    v-if="drop && !drop.isMintedOut"
    class="flex w-full justify-center mt-4"
  >
    <div
      class="rounded-full border justify-between items-center px-4 bg-background-color flex"
    >
      <div class="flex items-center">
        <span class="relative flex h-3 w-3 mr-2">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-k-primary opacity-75"
          />
          <span
            class="relative inline-flex rounded-full h-3 w-3 bg-k-primary"
          />
        </span>
        <span> {{ $t('drops.mintingNow') }} </span>
      </div>
      <div class="w-4 h-[1px] bg-separator-line-color mx-2" />
      <nuxt-link
        class="flex items-center font-bold my-2"
        :to="`/${drop?.chain}/drops/${drop?.alias}`"
      >
        {{ $t('drops.viewDrop') }}
      </nuxt-link>
    </div>
  </div>
  <div
    v-else
    class="flex w-full justify-center mt-4"
  >
    <NeoButton
      :tag="NuxtLink"
      :to="`/${drop?.chain}/drops/${drop?.alias}`"
      variant="secondary-rounded"
      icon-left="puzzle-piece"
      icon-pack="fal"
    >
      {{ $t('drops.exploreDrop') }}
    </NeoButton>
  </div>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'
import { getDropAttributes } from '../drops/utils'
import { getDrops } from '@/services/fxart'
import type { DropItem } from '@/params/types'

const NuxtLink = resolveComponent('NuxtLink')

const props = defineProps<{
  collectionId: string
}>()

const { urlPrefix } = usePrefix()

const drop = ref<DropItem>()

onBeforeMount(async () => {
  const fetchDrops = await getDrops({
    chain: [urlPrefix.value],
    collection: props.collectionId,
  })

  if (fetchDrops.length) {
    drop.value = await getDropAttributes(fetchDrops[0].alias)
  }
})
</script>
