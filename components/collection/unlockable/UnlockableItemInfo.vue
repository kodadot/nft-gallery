<template>
  <div v-if="isUnlockable">
    <hr class="text-color my-4" />
    <div class="columns is-desktop">
      <div
        class="column is-half-desktop is-flex is-flex-direction-column is-justify-content-center order-1">
        <div
          class="is-flex is-align-items-center has-text-weight-bold is-size-6 mb-2">
          <NeoIcon icon="unlock" class="mr-2" />
          {{ $t('mint.unlockable.howItemWork') }}
        </div>
        <div>
          Experience the excitement of unlocking hidden rewards! Get your hands
          on exclusive merchandise (and an NFT!) linked to unlockable content.
          For the next ten hours, the fastest ten individuals can mint their
          very own anime waifu character NFT for free. Simply log in with your
          wallet, click on the "Mint" button, and sign the transaction.
          Afterward, check your profile to find the NFT and click "Unlockable
          Content" to reveal the surprise. Follow the schedule so you don't miss
          this!
        </div>
        <NeoButton
          tag="a"
          href="https://hello.kodadot.xyz/fandom-toolbox/audience-growth/unlockables"
          target="_blank"
          variant="secondary"
          class="mt-2">
          {{ $t('helper.learnMore') }}
        </NeoButton>
      </div>
      <div class="column">
        <img src="/unlockable-introduce.svg" alt="Unlockable" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import { useUnlockable } from '#imports'
const props = defineProps({
  collectionId: {
    type: String,
    default: '',
  },
})
const { isUnlockable } = useUnlockable(
  computed(() => ({ id: props.collectionId })),
)
</script>
