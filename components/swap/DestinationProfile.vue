<template>
  <section class="pt-5 container is-fluid">
    <div class="flex justify-between">
      <div class="flex flex-col">
        <h1 class="title">
          {{ $t('swap.selectNft') }}
        </h1>
        <p class="subtitle">
          {{ $t('swap.clickOnNft') }}
        </p>
      </div>

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
          <CollectionDropCreatedBy :address="route.params.id" />
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <hr>
      </div>
      <div class="column">
        <div class="border bg-background-color shadow-primary p-5 pb-6 w-full h-min md:w-[444px] lg:w-[490px] relative">
          <header class="px-6 py-4 flex justify-between border-b items-center">
            <div class="text-base font-bold line-height">
              Your Swap List
            </div>
          </header>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'

const { accountId } = useAuth()
const route = useRoute()
</script>
