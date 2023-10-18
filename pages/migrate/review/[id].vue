<template>
  <div>
    <nuxt-link to="/migrate">
      <NeoButton variant="pill">
        <NeoIcon icon="arrow-left" class="mr-2" />
        Migration Homepage
      </NeoButton>
    </nuxt-link>

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
          <NeoButton variant="pill" class="mt-2">
            Kusama <NeoIcon icon="chevron-right" class="mx-4" /> Polkadot Asset
            Hub
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
          @click="true" />
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

const { urlPrefix } = usePrefix()
const { accountId } = useAuth()

definePageMeta({
  layout: 'no-footer',
})

const agree = ref(false)
const toggleFee = ref(true)
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
