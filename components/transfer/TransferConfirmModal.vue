<template>
  <NeoStickyModal
    v-model="isModalActive"
    :is-mobile="isMobile"
    :is-expanded="isExpandList"
    class="transfer-confirm-modal"
    :with-boxed-header="false"
    @close="onClose"
  >
    <template #header>
      <span>
        {{ $t('teleport.send') }}
        <span class="uppercase">{{ unit }}</span>
      </span>
    </template>

    <template #body>
      <div class="flex justify-between items-center py-4">
        <span class="font-bold text-base">{{ $t('activity.network') }}</span>
        <span class="flex items-center">
          <img
            class="mr-2 image size-6"
            :src="tokenIcon"
            alt="token"
          >
          {{ network }}
        </span>
      </div>

      <div class="flex justify-between items-center py-4 border-t-k-shade">
        <span class="font-bold text-base capitalize">{{
          $t('general.from')
        }}</span>
        <span class="flex items-center">
          <Avatar
            :value="accountId"
            :size="24"
          />
          <span class="ml-2 text-base">
            <Identity
              :address="accountId"
              hide-identity-popover
            />
          </span>
        </span>
      </div>

      <div class="flex justify-between items-center py-4 border-t-k-shade">
        <span class="font-bold text-base">{{ $t('transfers.sendTo') }}</span>
        <div
          v-if="targetAddresses.length === 1"
          class="flex items-center"
        >
          <Avatar
            :value="targetAddresses[0].address"
            :size="24"
          />
          <span class="mx-2 text-base">
            <Identity
              :address="targetAddresses[0].address"
              hide-identity-popover
            />
          </span>
          <NeoTooltip
            :label="targetAddresses[0].address"
            append-to-body
            content-class="transfer-tooltip"
          >
            <KIcon
              name="i-mdi:information-slab-circle-outline"
              class="text-base"
            />
          </NeoTooltip>
        </div>
        <div
          v-else
          class="cursor-pointer"
          @click="isExpandList = !isExpandList"
        >
          <span class="mx-2 text-base">
            {{ targetAddresses.length }} {{ $t('transfers.recipients') }}
          </span>
          <NeoIcon
            :icon="isExpandList ? 'angle-up' : 'angle-down'"
            pack="far"
          />
        </div>
      </div>

      <div class="fixed-height">
        <template v-if="isExpandList">
          <div
            v-for="(address, index) in targetAddresses"
            :key="address.address"
            class="py-4 border-t-k-shade text-xs"
          >
            <div class="flex justify-between items-center mb-2">
              <span class="text-k-grey">{{ $t('transfers.recipient') }} {{ index + 1 }}</span>
              <div class="flex items-center">
                <Avatar
                  :value="address.address"
                  :size="18"
                />
                <span class="mx-2 text-base">
                  <Identity
                    :address="address.address"
                    hide-identity-popover
                  />
                </span>
                <NeoTooltip
                  :label="address.address"
                  append-to-body
                  content-class="transfer-tooltip"
                >
                  <KIcon
                    name="i-mdi:information-slab-circle-outline"
                    class="text-base"
                  />
                </NeoTooltip>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-k-grey">{{ $t('amount') }}</span>

              <div class="flex items-center">
                <span class="text-k-grey">({{ address.token }} {{ unit }})</span>
                <span class="ml-1 text-base">${{ address.usd }}</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-between items-center mb-3">
        <span class="font-bold text-base">{{
          $t('transfers.totalAmount')
        }}</span>
        <div class="flex items-center">
          <span class="text-k-grey mr-1 text-xs">({{ displayTotalValue[0] }})</span>
          <span class="font-bold text-xl"> {{ displayTotalValue[1] }}</span>
        </div>
      </div>

      <NeoButton
        :label="$t('teleport.send')"
        variant="primary"
        no-shadow
        with-shortcut
        class="fixed-button-height flex flex-1"
        @click="confirmTransfer"
      />
    </template>
  </NeoStickyModal>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon, NeoStickyModal, NeoTooltip } from '@kodadot1/brick'
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
  () => NAMES[urlPrefix.value],
)
const isExpandList = ref(false)

const onClose = () => {
  emit('close')
}
</script>

<style lang="scss">
.transfer-confirm-modal {
  .fixed-height {
    height: 10rem;
  }

  .fixed-button-height {
    min-height: 55px;
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
