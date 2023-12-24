<template>
  <div>
    <ModalIdentityItem />
  </div>

  <p class="py-5 capitalize">
    <strong>{{ $t('drops.checkYourEmail') }}</strong>
    {{ $t('drops.toConfirmYourSubscription') }}
  </p>

  <div>
    <img :src="emailSubscriptionImage" />
  </div>

  <hr class="m-0 mb-2 mt-5" />

  <div class="capitalize text-xs has-text-k-grey">
    <p>
      {{ $t('drops.noEmail') }}
      <a class="has-text-k-blue" @click="$emit('resend')">{{
        $t('general.resend')
      }}</a>
      {{ $t('drops.checkSpamFolder') }}
    </p>

    <p class="mt-2">
      {{ $t('drops.wrongEmail') }}
      <a class="has-text-k-blue" @click="$emit('change')">{{
        $t('general.changeIt')
      }}</a>
    </p>
  </div>

  <div class="flex justify-between pt-4">
    <NeoButton
      class="flex flex-1 h-14 capitalize shine"
      :disabled="disabled"
      :loading="disabled"
      loading-with-label
      no-shadow
      variant="k-accent"
      native-type="submit"
      @click="submit">
      {{ submitButtonText }}
    </NeoButton>
  </div>

  <div v-if="emailNotConfirmed" class="mt-4 text-center capitalize">
    <p class="has-text-k-red is-size-7">{{ $t('drops.emailNotConfirmed') }}</p>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'

const emit = defineEmits(['check', 'change', 'resend'])
const props = defineProps<{
  email: string
  emailConfirmed: boolean
  checking: boolean
  resending: boolean
}>()

const { $i18n } = useNuxtApp()
const { isDarkMode } = useTheme()

const emailNotConfirmed = ref(false)

const emailSubscriptionImage = computed(() =>
  isDarkMode.value ? '/email-subscription-dark.svg' : '/email-subscription.svg',
)
const disabled = computed(() => props.checking || props.resending)

const submitButtonText = computed(() => {
  if (props.checking) {
    return $i18n.t('general.checking')
  }

  if (props.resending) {
    return $i18n.t('general.resending')
  }

  if (emailNotConfirmed.value) {
    return $i18n.t('general.checkAgain')
  }

  return $i18n.t('drops.iveConfirmed')
})

watch(
  [() => props.checking, () => props.emailConfirmed, () => props.resending],
  ([checking, emailConfirmed], [oldChecking]) => {
    emailNotConfirmed.value = false
    if (!checking && oldChecking) {
      emailNotConfirmed.value = !emailConfirmed
    }
  },
)

const submit = () => {
  emit('check')
}
</script>
