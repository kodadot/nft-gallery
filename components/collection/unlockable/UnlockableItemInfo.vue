<template>
  <div v-if="isUnlockable">
    <hr class="text-color my-4">
    <div class="flex flex-col lg:flex-row gap-3">
      <div
        class="flex-1 lg:flex-0 lg:w-1/2 flex flex-col justify-center order-1"
      >
        <div class="flex items-center font-bold text-base mb-2">
          <KIcon
            name="i-mdi:lock-open"
            class="mr-2"
          />
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
          class="mt-2"
        >
          {{ $t('helper.learnMore') }}
        </NeoButton>
      </div>
      <div class="flex-1">
        <img
          src="https://raw.githubusercontent.com/kodadot/nft-gallery/refs/heads/main/assets/svg/unlockable-introduce.svg"
          alt="Unlockable"
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'

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
