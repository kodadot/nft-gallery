<template>
  <section class="pt-5 container is-fluid">
    <div class="flex justify-between">
      <div class="flex flex-col">
        <h1 class="title">
          Select their NFTs for the Swap
        </h1>
        <p class="subtitle">
          Click on any NFT to add it to your swap list.
        </p>
      </div>

      <div class="flex items-center">
        <div>
          <div class="font-bold is-size-5 mb-4 capitalize">
            Your Address
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
            Counterparty
          </div>
          <CollectionDropCreatedBy :address="route.params.id" />
        </div>
      </div>
    </div>

    <hr>
  </section>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'

const { accountId } = useAuth()
const route = useRoute()
</script>
