<template>
  <ModalBody
    :title="$t('reconnect.required')"
    :scrollable="false"
    @close="closeAllModals"
  >
    <div>
      <div class="flex gap-5 items-center justify-center !py-5 ">
        <div>
          <BasicImage
            :src="vmSwitchDetails.current.icon"
            :alt="vmSwitchDetails.current.name"
            class="image is-48x48"
          />
        </div>

        <img
          :src="isDarkMode ? '/right-arrow_dark.svg' :'/right-arrow.svg'"
          alt="right arrow"
        >

        <div>
          <BasicImage
            :src="vmSwitchDetails.target.icon"
            :alt="vmSwitchDetails.target.name"
            class="image is-48x48"
          />
        </div>
      </div>

      <div class="flex flex-col gap-2 items-center capitalize !mt-3">
        <p class="font-bold text-xl">
          {{ $t("reconnect.title") }}
        </p>
        <p
          v-dompurify-html="$t('reconnect.toProceed', [vmSwitchDetails.target.name, vmSwitchDetails.target.shortName ? `(${vmSwitchDetails.target.shortName})` : undefined])"
          class="max-w-60 text-center"
        />
      </div>

      <div class="flex justify-between !pt-8">
        <NeoButton
          :label="$t('reconnect.switch')"
          variant="primary"
          no-shadow
          :loading="loading"
          :disabled="loading"
          class="flex flex-grow !h-[3.5rem]"
          @click="switchWallet"
        />
      </div>
    </div>
  </ModalBody>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { type ChainVM } from '@kodadot1/static'
import ModalBody from '@/components/shared/modals/ModalBody.vue'

const VM_SWITCH_MAP: Record<ChainVM, ChainVM> = {
  EVM: 'SUB',
  SUB: 'EVM',
}

const emit = defineEmits(['close', 'connect'])

const { logout } = useWallet()
const { getWalletVM } = storeToRefs(useWalletStore())
const { doAfterLogin } = useDoAfterlogin()
const { isDarkMode } = useTheme()
const { neoModal } = useProgrammatic()

const loading = ref(false)

const vmDetails = computed<Record<ChainVM, { icon: string, name: string, shortName?: string }>>(() => ({
  SUB: {
    name: 'Polkadot',
    icon: isDarkMode.value ? '/token/dot_branded_dark.svg' : '/token/dot_branded.svg',
  },
  EVM: {
    name: 'Ethereum',
    shortName: 'EVM',
    icon: isDarkMode.value ? '/token/base_branded_dark.svg' : '/token/base_branded.svg',

  },
}))

const currentWalletVM = computed(() => getWalletVM.value || 'SUB')

const targetVm = computed(() => VM_SWITCH_MAP[currentWalletVM.value]) // make prop
const vmSwitchDetails = computed(() => ({
  current: vmDetails.value[currentWalletVM.value],
  target: vmDetails.value[targetVm.value],
}))

const switchWallet = async () => {
  loading.value = true

  await logout()

  doAfterLogin({
    onLoginSuccess: () => emit('connect'),
    onCancel: () => {
      loading.value = false
    },
    preselected: targetVm.value,
  })
}

const closeAllModals = () => neoModal.closeAll()
</script>
