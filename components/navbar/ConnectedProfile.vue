<template>
  <div>
    <NeoSkeleton
      v-if="isFetchingProfile"
      class="!w-[120px] !h-[40px] rounded-full overflow-hidden"
      width="100%"
      height="100%"
      no-margin
    />
    <NeoButton
      v-else
      variant="outlined-rounded"
      root-class="!px-2"
      label-class="flex gap-[10px] items-center"
      aria-label="open profile menu"
      :active="isWalletModalOpen"
      @click="$emit('click')"
    >
      <div class="relative">
        <ProfileAvatar
          class="!p-0 !border-none !block"
          :address="address"
          :size="24"
          no-margin
        />
        <div class="absolute -right-[6px] -bottom-[2px] h-4">
          <img
            :src="chainIcon"
            class="bg-neutral-3 dark:bg-neutral-11 p-[2px] rounded-full h-full"
          >
        </div>
      </div>

      <span class="max-w-20 min-w-12 truncate">
        {{ label }}
      </span>
    </NeoButton>
  </div>
</template>

<script lang="ts" setup>
import { NeoButton, NeoSkeleton } from '@kodadot1/brick'
import { useChainId } from '@wagmi/vue'

defineEmits(['click'])
const props = defineProps<{ address: string }>()

const { getChainIcon } = useIcon()
const { userProfile: profile, isFetchingProfile } = useProfile(computed(() => props.address))
const { getWalletVM } = storeToRefs(useWalletStore())
const { isWalletModalOpen } = useWallet()
const chainId = useChainId()

const label = computed(() => profile.value ? profile.value?.name : shortAddress(props.address, 3, -3))

const chainIcon = computed(() => getChainIcon(execByVm({
  SUB: () => 'ahp',
  EVM: () => CHAIN_ID_TO_PREFIX[chainId.value] ?? '',
}, { vm: getWalletVM.value })))
</script>
