<template>
  <div class="flex items-center">
    <div>
      <div class="font-bold is-size-5 mb-4 capitalize">
        {{ $t('swap.yourAddress') }}
      </div>
      <CollectionDropCreatedBy :address="accountId" />
    </div>
    <div>
      <NeoIcon
        class="pt-8 px-4"
        icon="arrow-right-arrow-left"
        size="large"
      />
    </div>
    <div>
      <div class="font-bold is-size-5 mb-4 capitalize">
        {{ $t('swap.counterparty') }}
      </div>
      <CollectionDropCreatedBy :address="counterparty" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoIcon } from '@kodadot1/brick'

const { accountId } = useAuth()

defineProps<{
  counterparty: string
}>()
</script>
