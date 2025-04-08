<template>
  <div class="flex ">
    <div class="flex flex-col gap-4 justify-start">
      <div class="font-bold text-xl capitalize">
        {{ $t('swap.yourAddress') }}
      </div>
      <CollectionDropCreatedBy
        v-if="creator"
        :address="creator"
        :show-popover="false"
      />
      <Auth v-else />
    </div>
    <div>
      <KIcon
        class="pt-8 px-4"
        name="i-mdi:swap-horizontal"
        size="large"
      />
    </div>
    <div class="flex flex-col gap-4 justify-start">
      <div class="font-bold text-xl capitalize">
        {{ $t('swap.counterparty') }}
      </div>
      <SwapBannerCollectionPreview
        v-if="isCollectionSwap"
        :collection-id="counterparty"
      />
      <CollectionDropCreatedBy
        v-else
        :address="counterparty"
        :show-popover="false"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  creator?: string
  counterparty: string
  isCollectionSwap?: boolean
}>()
</script>
