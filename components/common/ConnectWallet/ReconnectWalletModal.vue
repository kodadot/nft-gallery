<template>
  <ModalBody
    class="border border-border-color"
    :title="$t('reconnect.required')"
    :scrollable="false"
  >
    <div>
      <div class="flex gap-5 items-center justify-center !py-5 ">
        <div>
          <BasicImage
            :src="vmDetails.current.icon"
            :alt="vmDetails.current.name"
            class="image is-48x48"
          />
        </div>

        <img
          :src="'/right-arrow.svg'"
          alt="right arrow"
        >

        <div>
          <BasicImage
            :src="vmDetails.target.icon"
            :alt="vmDetails.target.name"
            class="image is-48x48"
          />
        </div>
      </div>

      <div class="flex flex-col gap-2 items-center capitalize !mt-3">
        <p class="font-bold text-xl">
          {{ $t("reconnect.title") }}
        </p>
        <p
          v-dompurify-html="$t('reconnect.toProceed', [vmDetails.target.name, vmDetails.target.shortName ? `(${vmDetails.target.shortName})` : undefined])"
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

const VM_DETAILS: Record<ChainVM, { icon: string, name: string, shortName?: string }> = {
  SUB: {
    name: 'Polkadot',
    icon: '/token/dot_branded.svg',
  },
  EVM: {
    name: 'Ethereum',
    shortName: 'EVM',
    icon: '/token/base_branded.svg',
  },
}

const emit = defineEmits(['close', 'connect'])

const { logout } = useWallet()
const instance = getCurrentInstance()
const { vm } = useChain()
const { doAfterLogin } = useDoAfterlogin(instance)

const loading = ref(false)

const targetVm = computed(() => VM_SWITCH_MAP[vm.value]) // make prop
const vmDetails = computed(() => ({
  current: VM_DETAILS[vm.value],
  target: VM_DETAILS[targetVm.value],
}))

const switchWallet = async () => {
  loading.value = true

  await logout()

  doAfterLogin({
    onLoginSuccess: () => emit('connect'),
    onCancel: () => {
      loading.value = false
    },
    componentProps: {
      preselected: targetVm.value,
    },
  })
}
</script>
