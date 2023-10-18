<template>
  <div>
    <NeoButton variant="pill" @click="promptModal()">
      <NeoIcon icon="arrow-left" class="mr-2" />
      Migration Homepage
    </NeoButton>

    <div class="mt-8 is-centered columns">
      <div class="is-4 column">
        <h1 class="is-size-4 has-text-weight-bold">
          Review <span class="has-text-grey">- Sign</span>
        </h1>

        <hr />

        <div
          class="rounded shade-border-color is-flex is-justify-content-start is-flex-grow-1 pl-3">
          <IdentityItem
            :label="$t('confirmPurchase.connectedWith')"
            hide-identity-popover
            disable-identity-link
            :prefix="urlPrefix"
            :account="accountId"
            class="identity-name-font-weight-regular"
            data-testid="item-creator" />
        </div>

        <div class="mt-5">
          <p class="has-text-weight-bold">Migrate Collection</p>
          <div class="is-flex mt-4">
            <img
              class="border mr-4"
              src="https://plus.unsplash.com/premium_photo-1697188001642-92c80c7e0073?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=48&h=48&q=60"
              alt="My crazy adventure"
              width="48"
              height="48" />
            <div>
              <p>My Crazy Adventure</p>
              <p class="has-text-grey is-size-7">(name will stay the same)</p>
            </div>
          </div>
        </div>

        <hr />

        <div class="is-flex is-justify-content-space-between mb-5">
          <p>{{ $t('migrate.ready.status') }}</p>
          <p>1790/2000</p>
        </div>

        <div class="shade-border-color p-2 is-flex is-size-7 has-text-grey">
          <NeoIcon icon="circle-info" class="mr-2" />
          <p>
            Please note that at this stage, only items you own can be migrated.
            For other items, you will need to pre-sign them to allow others to
            follow your migration initiative.
          </p>
        </div>

        <div>
          <p class="has-text-weight-bold mt-5">Route:</p>
          <NeoButton rounded variant="pill" class="mt-2">
            <div class="is-flex is-align-items-center">
              <img
                width="20"
                :src="source?.icon"
                :alt="source?.text"
                class="mr-2" />
              {{ source?.text }}
            </div>
            <NeoIcon icon="chevron-right" class="mx-4" />
            <div class="is-flex is-align-items-center">
              <img
                width="20"
                :src="destination?.icon"
                :alt="destination?.text"
                class="mr-2" />
              {{ destination?.text }}
            </div>
          </NeoButton>
        </div>

        <hr />

        <div>
          <div class="has-text-weight-bold mt-5">Costs</div>

          <div class="is-size-7">
            <p
              class="my-2 has-text-grey is-cursor-pointer"
              @click="toggleFee = !toggleFee">
              Fee Breakdown
              <NeoIcon :icon="toggleFee ? 'chevron-up' : 'chevron-down'" />
            </p>

            <div v-if="toggleFee">
              <p>Network Fee</p>

              <div class="is-flex is-justify-content-space-between mt-1">
                <div>
                  <NeoIcon
                    icon="arrow-turn-up"
                    class="fa-flip-horizontal has-text-grey" />
                  Create Collection
                </div>

                <div>0.02 KSM</div>
              </div>

              <div class="is-flex is-justify-content-space-between mt-1">
                <div>
                  <NeoIcon
                    icon="arrow-turn-up"
                    class="fa-flip-horizontal has-text-grey" />
                  Migrate 1790 Items
                </div>

                <div>3x 0.02 KSM</div>
              </div>

              <div class="is-flex is-justify-content-space-between mt-1">
                <div>
                  <NeoIcon
                    icon="arrow-turn-up"
                    class="fa-flip-horizontal has-text-grey" />
                  Pre-Sign 210 Items
                </div>

                <div>0.01 KSM</div>
              </div>

              <div
                class="has-text-grey is-flex mt-1 is-align-items-center is-justify-content-space-between">
                <div>
                  Existential Deposit
                  <NeoTooltip
                    position="top"
                    class="is-cursor-pointer"
                    multiline-width="14rem"
                    multiline
                    label="tooltip label here">
                    <NeoIcon icon="circle-question" />
                  </NeoTooltip>
                </div>
                <Money value="100000000000" unit-symbol="KSM" inline />
              </div>

              <div
                class="is-flex mt-1 has-text-grey is-align-items-center is-justify-content-space-between">
                <div>
                  {{ $t('mint.nft.modal.kodadotFee') }}
                  <NeoTooltip
                    class="is-cursor-pointer"
                    position="top"
                    multiline-width="14rem"
                    :label="$t('mint.nft.modal.kodadotTooltip')"
                    multiline>
                    <NeoIcon icon="circle-question" />
                  </NeoTooltip>
                </div>
                <div>0.1358 KSM</div>
              </div>
            </div>
          </div>
        </div>

        <hr />

        <div class="pb-7 is-flex is-justify-content-space-between">
          <div class="">{{ $t('mint.nft.modal.totalFee') }}:</div>
          <div class="is-flex is-align-items-center">
            <div class="has-text-k-grey is-size-7 mr-2">$108</div>
            <div>10.9 KSM</div>
          </div>
        </div>

        <NeoField>
          <NeoCheckbox v-model="agree">
            I understand this action is irreversible once done.
          </NeoCheckbox>
        </NeoField>

        <NeoButton
          label="Acknowledge Before Proceeding"
          variant="k-accent"
          :disabled="!agree"
          class="mt-4 btn-submit"
          expanded
          @click="toSign()" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NeoButton,
  NeoCheckbox,
  NeoField,
  NeoIcon,
  NeoTooltip,
} from '@kodadot1/brick'
import IdentityItem from '@/components/identity/IdentityItem.vue'
import { availablePrefixWithIcon } from '@/utils/chain'
import MigrateModal from '@/components/migrate/MigrateModal.vue'

const { urlPrefix } = usePrefix()
const { accountId } = useAuth()
const { neoModal } = useProgrammatic()
const route = useRoute()

definePageMeta({
  layout: 'no-footer',
})

const promptModal = async () => {
  const instance = neoModal.open({
    component: MigrateModal,
    contentClass: 'k-shadow border',
    trapFocus: true,
  })
  const result: { action: 'yes' | 'no' } = await instance.promise

  if (result.action === 'yes') {
    navigateTo('/migrate')
  }
}

const agree = ref(false)
const toggleFee = ref(true)
const source = availablePrefixWithIcon().find(
  (item) => item.value === route.query.source,
)
const destination = availablePrefixWithIcon().find(
  (item) => item.value === route.query.destination,
)

const toSign = () => {
  navigateTo({
    path: '/migrate/sign',
    query: {
      ...route.query,
    },
  })
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.rounded {
  border-radius: 10rem;
}

.shade-border-color {
  @include ktheme() {
    border: 1px solid theme('k-shade');
  }
}

.btn-submit {
  height: 3.5rem;
}
</style>
