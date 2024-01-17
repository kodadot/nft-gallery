<template>
  <div>
    <p class="text-k-grey mb-6">
      {{ $t('mint.unlockable.requirements') }}
    </p>

    <div>
      <div class="flex justify-between">
        <div class="flex gap-4 flex-col w-full">
          <MintRequirementItem
            v-if="showHolderOfCollection && collection"
            :fulfilled="Boolean(holderOfCollection.isHolder)">
            <div class="flex justify-between items-center w-full">
              <p class="capitalize">
                Holder of NFT from
                <nuxt-link
                  class="has-text-link"
                  :to="`/${urlPrefix}/collection/${props.holderOfCollection.id}`">
                  {{ collection?.name }}
                </nuxt-link>
                collection
              </p>
              <div v-if="!isMintedOut" class="text-xs">
                <span class="text-k-grey capitalize mr-2">
                  {{ $t('mint.unlockable.availableForMint') }}
                </span>
                <span
                  >{{ props.holderOfCollection.amount?.used }}/{{
                    props.holderOfCollection.amount?.total
                  }}</span
                >

                <NeoTooltip
                  position="top"
                  multiline
                  multiline-width="15rem"
                  root-class="ml-2"
                  content-class="capitalize">
                  <NeoIcon
                    icon="fa-info-circle"
                    pack="fa-regular"
                    class="text-k-grey" />

                  <template #content>
                    <p
                      v-dompurify-html="
                        $t('mint.unlockable.holderOfWarning1', [
                          collection?.name,
                        ])
                      "
                      class="mb-3" />
                    <p
                      v-dompurify-html="
                        $t('mint.unlockable.holderOfWarning2')
                      " />
                  </template>
                </NeoTooltip>
              </div>
            </div>
          </MintRequirementItem>
          <MintRequirementItem
            v-if="checkMinimumFunds"
            :fulfilled="minimumFunds.hasAmount">
            <p v-dompurify-html="minimumFunds.description" />
          </MintRequirementItem>
        </div>
      </div>

      <div
        class="flex items-center mt-2"
        :class="[isMintedOut ? 'justify-end' : 'justify-between']">
        <div
          v-if="!isMintedOut"
          class="border px-2 py-1 rounded-full h-fit w-fit capitalize text-xs flex"
          :class="[readyToMint ? 'bg-k-green-accent' : 'bg-neutral-5']">
          <p>
            {{ mintLabel }}
          </p>

          <NeoIcon v-if="readyToMint" class="ml-1" icon="check" />
        </div>

        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MintRequirementItem from './MintRequirementItem.vue'
import { useCollectionMinimal } from '@/components/collection/utils/useCollectionDetails'
import { NeoIcon, NeoTooltip } from '@kodadot1/brick'

const props = defineProps<{
  holderOfCollection: {
    id?: string
    isHolder?: boolean
    amount?: {
      total: number
      used: number
    }
  }
  minimumFunds: { amount: number; description: string; hasAmount: boolean }
  isMintedOut: boolean
}>()

const { $i18n } = useNuxtApp()
const { urlPrefix } = usePrefix()
const { accountId } = useAuth()

const { collection } = useCollectionMinimal({
  collectionId: computed(() => props.holderOfCollection.id || ''),
})

const showHolderOfCollection = computed(() => !!props.holderOfCollection.id)

const checkMinimumFunds = computed(() => Boolean(props.minimumFunds.amount))

const readyToMint = computed(
  () =>
    Boolean(props.holderOfCollection.isHolder) &&
    checkMinimumFunds.value &&
    props.minimumFunds.hasAmount,
)

const availableForMint = computed(
  () =>
    (props.holderOfCollection.amount?.total || 0) -
    (props.holderOfCollection.amount?.used || 0),
)

const mintLabel = computed(() => {
  if (!accountId.value) {
    return $i18n.t('mint.unlockable.connectWallet')
  }

  if (readyToMint.value) {
    return $i18n.t('mint.unlockable.readyToMint', [availableForMint.value])
  }

  return $i18n.t('mint.unlockable.requirementsNotMet')
})
</script>
