<template>
  <div class="flex ">
    <div class="flex flex-col gap-4 justify-start">
      <div class="font-bold text-xl capitalize">
        {{ $t('swap.yourAddress') }}
      </div>
      <CollectionDropCreatedBy
        v-if="creator"
        :address="creator"
      />
      <Auth v-else />
    </div>
    <div>
      <NeoIcon
        class="pt-8 px-4"
        icon="arrow-right-arrow-left"
        size="large"
      />
    </div>
    <div class="flex flex-col gap-4 justify-start">
      <div class="font-bold text-xl capitalize">
        {{ $t('swap.counterparty') }}
      </div>
      <CollectionDropCreatedBy :address="counterparty" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoIcon } from '@kodadot1/brick'

defineProps<{
  creator?: string
  counterparty: string
}>()
</script>
