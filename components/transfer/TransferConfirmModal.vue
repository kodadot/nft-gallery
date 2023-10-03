<template>
  <NeoModal
    v-model="isModalActive"
    :no-shadow="isMobile"
    :content-class="[
      'transfer-confirm-modal',
      isMobile ? 'only-top-border' : '',
      isExpandList ? 'mobile-modal-height' : '',
    ]"
    max-height="90vh"
    scroll="clip"
    @close="emit('close')">
    <div
      :class="[
        'is-flex is-flex-direction-column is-justify-content-space-between',
        {
          'modal-width': !isMobile,
          'h-full pb-6': isMobile,
        },
      ]">
      <div>
        <header
          class="is-flex is-justify-content-center is-align-items-center header px-6 py-3">
          <span class="is-size-5 has-text-weight-bold">
            {{ $t('teleport.send') }}
            <span class="is-uppercase">{{ unit }}</span>
          </span>
          <NeoButton
            class="position-right mr-6 py-1 px-2"
            variant="text"
            no-shadow
            icon="xmark"
            size="medium"
            @click.native="closeModal" />
        </header>
        <div
          :class="[
            {
              'is-bordered-top scroll-height': isExpandList,
            },
            'px-6 is-scrollable',
          ]">
          <div
            class="is-flex is-justify-content-space-between is-align-items-center py-4">
            <span class="has-text-weight-bold is-size-6">{{
              $t('activity.network')
            }}</span>
            <span class="is-flex is-align-items-center">
              <img class="mr-2 image is-24x24" :src="tokenIcon" alt="token" />
              {{ network }}
            </span>
          </div>
          <div
            class="is-flex is-justify-content-space-between is-align-items-center py-4 is-bordered-top">
            <span class="has-text-weight-bold is-size-6 is-capitalized">{{
              $t('general.from')
            }}</span>
            <span class="is-flex is-align-items-center">
              <Avatar :value="accountId" :size="24" />
              <span class="ml-2 is-size-6">
                <Identity :address="accountId" hide-identity-popover />
              </span>
            </span>
          </div>

          <div
            class="is-flex is-justify-content-space-between is-align-items-center py-4 is-bordered-top">
            <span class="has-text-weight-bold is-size-6">{{
              $t('transfers.sendTo')
            }}</span>
            <div
              v-if="targetAddresses.length === 1"
              class="is-flex is-align-items-center">
              <Avatar :value="targetAddresses[0].address" :size="24" />
              <span class="mx-2 is-size-6">
                <Identity
                  :address="targetAddresses[0].address"
                  hide-identity-popover />
              </span>
              <NeoTooltip
                :label="targetAddresses[0].address"
                append-to-body
                content-class="transfer-tooltip">
                <NeoIcon icon="circle-info" class="is-size-6" />
              </NeoTooltip>
            </div>
            <div
              v-else
              class="is-clickable"
              @click="isExpandList = !isExpandList">
              <span class="mx-2 is-size-6">
                {{ targetAddresses.length }} {{ $t('transfers.recipients') }}
              </span>
              <NeoIcon :icon="isExpandList ? 'angle-up' : 'angle-down'" />
            </div>
          </div>
          <div class="fixed-height">
            <template v-if="isExpandList">
              <div
                v-for="(address, index) in targetAddresses"
                :key="address.address"
                class="py-4 is-bordered-top is-size-7">
                <div
                  class="is-flex is-justify-content-space-between is-align-items-center mb-2">
                  <span class="has-text-grey"
                    >{{ $t('transfers.recipient') }} {{ index + 1 }}</span
                  >
                  <div class="is-flex is-align-items-center">
                    <Avatar :value="address.address" :size="18" />
                    <span class="mx-2 is-size-6">
                      <Identity
                        :address="address.address"
                        hide-identity-popover />
                    </span>
                    <NeoTooltip
                      :label="address.address"
                      append-to-body
                      content-class="transfer-tooltip">
                      <NeoIcon icon="circle-info" class="is-size-6" />
                    </NeoTooltip>
                  </div>
                </div>
                <div
                  class="is-flex is-justify-content-space-between is-align-items-center">
                  <span class="has-text-grey">{{ $t('amount') }}</span>

                  <div class="is-flex is-align-items-center">
                    <span class="has-text-grey"
                      >({{ address.token }} {{ unit }})</span
                    >
                    <span class="ml-1 is-size-6">${{ address.usd }}</span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <div
        :class="[
          'is-flex is-flex-direction-column px-6 py-5 is-bordered-top',
          {
            'pb-6': isMobile,
          },
        ]">
        <div
          class="is-flex is-justify-content-space-between is-align-items-center mb-3">
          <span class="has-text-weight-bold is-size-6">{{
            $t('transfers.totalAmount')
          }}</span>
          <div class="is-flex is-align-items-center">
            <span class="has-text-grey mr-1 is-size-7"
              >({{ displayTotalValue[0] }})</span
            >
            <span class="has-text-weight-bold is-size-5">
              {{ displayTotalValue[1] }}</span
            >
          </div>
        </div>

        <NeoButton
          :label="$t('teleport.send')"
          variant="k-accent"
          no-shadow
          class="fixed-button-height is-flex is-flex-1"
          @click.native="confirmTransfer" />
      </div>
    </div>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon, NeoModal, NeoTooltip } from '@kodadot1/brick'
import { NAMES } from '@/libs/static/src/names'
import Avatar from '@/components/shared/Avatar.vue'
import Identity from '@/components/identity/IdentityIndex.vue'
import type { TargetAddress } from '@/components/transfer/Transfer.vue'
const props = defineProps<{
  isModalActive: boolean
  tokenIcon: string
  unit: string
  isMobile: boolean
  displayTotalValue: string[]
  targetAddresses: TargetAddress[]
}>()

const isModalActive = useVModel(props, 'isModalActive')

const { urlPrefix } = usePrefix()
const emit = defineEmits(['close', 'confirm'])

const closeModal = () => {
  emit('close')
}

const confirmTransfer = () => {
  closeModal()
  emit('confirm')
}
const { accountId } = useAuth()

const network = computed(
  // naming: rmrk2 -> kusama
  () => NAMES[urlPrefix.value === 'ksm' ? 'rmrk' : urlPrefix.value]
)
const isExpandList = ref(false)
</script>

<style lang="scss">
@import '@/styles/abstracts/variables';

.transfer-confirm-modal {
  @include mobile {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 0.75rem 0.75rem 0 0;

    &.mobile-modal-height {
      height: 90vh;
    }
  }

  &.only-top-border {
    border-right: 0 !important;
    border-left: 0 !important;
    border-bottom: 0 !important;
  }

  .scroll-height {
    height: 50vh;
    @include mobile {
      height: 60vh;
    }
  }

  .modal-width {
    width: 28rem;
  }
  .header {
    position: relative;
  }
  .position-right {
    position: absolute;
    right: 0;
  }

  .fixed-height {
    height: 10rem;
  }

  .fixed-button-height {
    min-height: 55px;
  }

  .is-scrollable {
    overflow-y: auto;
  }
  .is-bordered-top {
    @include ktheme() {
      border-top: 1px solid theme('k-shade');
    }
  }
}
</style>
<style lang="scss">
// manually calculated number, based on address length and container padding, not the best solution but it works :)
.o-tip__content.transfer-tooltip {
  transform: translateX(-22rem);
  .o-tip__arrow {
    transform: translateX(10rem);
  }
}
</style>
