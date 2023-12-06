<template>
  <div>
    <ModalIdentityItem />
  </div>

  <p class="py-5 is-capitalized">
    {{ $t('drops.subscribe') }}
  </p>

  <div class="mb-5">
    <div class="is-capitalized is-flex is-align-items-center">
      <span>{{ $t('drops.plusGetA') }}</span>

      <div class="px-2 is-flex is-align-items-center">
        <img width="58" :src="signUpVoucherIcon" alt="shop voucher" />
      </div>

      <span>{{ $t('drops.voucherToOurShop') }}</span>
    </div>

    <p class="has-text-k-grey is-capitalized mt-3 is-size-7">
      ({{ $t('drops.justConfirmSubscriptionViaEmail') }})
    </p>
  </div>

  <form @submit.prevent="confirm">
    <NeoInput
      ref="emailInput"
      v-model="email"
      type="email"
      required
      :placeholder="$t('mint.nft.email.placeholder')" />

    <div class="pt-5">
      <NeoCheckbox v-model="agree" class="is-capitalized">
        {{ $t('drops.consent') }}
      </NeoCheckbox>
    </div>

    <div class="is-flex is-justify-content-space-between pt-4">
      <NeoButton
        class="is-flex is-flex-1 h-14 is-capitalized shine"
        :disabled="disabled"
        no-shadow
        variant="k-accent"
        native-type="submit">
        {{ submitButtonText }}
      </NeoButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { NeoButton, NeoCheckbox, NeoInput } from '@kodadot1/brick'
import ModalIdentityItem from '@/components/shared/ModalIdentityItem.vue'

const emit = defineEmits(['confirm'])

const { $i18n } = useNuxtApp()
const { signUpVoucherIcon } = useIcon()

const emailInput = ref()
const email = ref()
const agree = ref(false)

const invalidEmail = computed(() => !emailInput.value?.checkHtml5Validity())

const disabled = computed(
  () => invalidEmail.value || email.value === '' || !agree.value,
)

const submitButtonText = computed(() => {
  if (invalidEmail.value) {
    return $i18n.t('drops.enterValidEmail')
  }

  if (!agree.value) {
    return $i18n.t('drops.agreeToProceed')
  }

  return $i18n.t('drops.subscribeAndClaim')
})

const confirm = () => {
  emit('confirm', email.value)
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';
@import '@/assets/styles/abstracts/animations';

.modal-width {
  width: 25rem;
}

.shine:not(:hover):not(:disabled) {
  @include shineEffect(var(--k-accent-light-3), lightgrey, false);

  &:hover {
    color: var(--k-accent2) !important;
  }
}
</style>
