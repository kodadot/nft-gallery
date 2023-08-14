<template>
  <NeoModal v-model="isModalActive" scroll="clip" @close="emit('close')">
    <div
      class="modal-width is-flex is-flex-direction-column is-justify-content-space-between">
      <div>
        <header
          class="is-flex is-justify-content-center is-align-items-center header px-6 py-3">
          <span class="is-size-5 has-text-weight-bold">
            {{ $t('teleport.send') }}
            <span class="is-uppercase">{{ unit }}</span>
          </span>
          <NeoButton
            class="position-right mr-6"
            variant="text"
            icon="close"
            no-shadow
            icon-pack="fas"
            @click.native="closeModal" />
        </header>
        <div
          :class="[
            {
              'is-bordered-top': isExpandList,
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
              <NeoIcon
                icon="circle-info"
                pack="far"
                :title="targetAddresses[0].address" />
            </div>
            <div
              v-else
              class="is-clickable"
              @click="isExpandList = !isExpandList">
              <span class="mx-2 is-size-6">
                {{ targetAddresses.length }} {{ $t('transfers.recipients') }}
              </span>
              <NeoIcon
                :icon="isExpandList ? 'angle-up' : 'angle-down'"
                pack="far" />
            </div>
          </div>
          <div class="fixed-height">
            <template v-if="isExpandList">
              <div
                v-for="(address, index) in targetAddresses"
                :key="address.address"
                class="py-4 is-bordered-top is-small-size-text">
                <div
                  class="is-flex is-justify-content-space-between is-align-items-center mb-2">
                  <span class="has-text-weight-bold"
                    >{{ $t('transfers.recipient') }} {{ index + 1 }}</span
                  >
                  <div class="is-flex is-align-items-center">
                    <Avatar :value="address.address" :size="18" />
                    <span class="mx-2">
                      <Identity
                        :address="address.address"
                        hide-identity-popover />
                    </span>
                    <NeoIcon
                      icon="circle-info"
                      pack="far"
                      :title="address.address" />
                  </div>
                </div>
                <div
                  class="is-flex is-justify-content-space-between is-align-items-center">
                  <span class="has-text-weight-bold">{{ $t('amount') }}</span>

                  <div class="is-flex is-align-items-center">
                    <span class="has-text-grey"
                      >({{ address.token }} {{ unit }})</span
                    >
                    <span class="ml-1">${{ address.usd }}</span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <div class="is-flex is-flex-direction-column px-6 py-5 is-bordered-top">
        <div
          class="is-flex is-justify-content-space-between is-align-items-center mb-3">
          <span class="has-text-weight-bold is-size-6">{{
            $t('transfers.totalAmount')
          }}</span>
          <div class="is-flex is-align-items-center">
            <span class="has-text-grey mr-1 is-small-size-text"
              >({{ totalTokenAmount }} {{ unit }})</span
            >

            <span class="has-text-weight-bold is-size-5">
              ${{ totalUsdValue }}</span
            >
          </div>
        </div>

        <NeoButton
          :label="$t('teleport.send')"
          variant="k-accent"
          class="fixed-button-height is-flex is-flex-1"
          @click.native="confirmTransfer" />
      </div>
    </div>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon, NeoModal } from '@kodadot1/brick'
import { NAMES } from '@/libs/static/src/names'
import Avatar from '@/components/shared/Avatar.vue'
import Identity from '@/components/identity/IdentityIndex.vue'
import type { TargetAddress } from '@/components/transfer/Transfer.vue'
const props = defineProps<{
  isModalActive: boolean
  totalTokenAmount: string
  totalUsdValue: number
  tokenIcon: string
  unit: string
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

const network = computed(() => NAMES[urlPrefix.value])
const isExpandList = ref(false)
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

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
.is-small-size-text {
  font-size: 14px;
}

.is-scrollable {
  overflow-y: auto;
}
.is-bordered-top {
  @include ktheme() {
    border-top: 1px solid theme('k-shade');
  }
}
</style>
