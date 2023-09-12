<template>
  <section>
    <Loader v-model="isLoading" :status="status" />
    <form @submit.prevent>
      <h1 class="title is-size-3">
        {{ $t('identity.set') }}
        <NeoTooltip
          :label="$t('identity.fundsReserve')"
          position="bottom"
          multiline>
          <NeoIcon icon="info-circle" pack="fass" />
        </NeoTooltip>
      </h1>

      <p v-if="accountId" class="subtitle is-size-6">
        <Auth />
        <span>{{ $t('general.balance') }}: </span>
        <Money :value="balance" inline />
      </p>

      <NeoField label="Handle">
        <NeoInput
          v-model="identity.display"
          :placeholder="$t('identity.onChainPlaceholder')"
          :maxlength="inputLengthLimit"
          required
          :validation-message="$t('identity.handleRequired')" />
      </NeoField>

      <BasicInput
        v-model="identity.legal"
        :label="$t('name')"
        :maxlength="inputLengthLimit"
        :placeholder="$t('identity.namePlaceholder')"
        expanded />

      <BasicInput
        v-model="identity.email"
        type="email"
        :maxlength="inputLengthLimit"
        :label="$t('Email')"
        placeholder="somebody@example.com"
        expanded />

      <BasicInput
        v-model="identity.web"
        label="Web"
        :maxlength="inputLengthLimit"
        placeholder="https://example.com"
        expanded />

      <BasicInput
        v-model="identity.twitter"
        label="Twitter"
        :maxlength="inputLengthLimit"
        placeholder="@YourTwitterName"
        expanded />

      <BasicInput
        v-model="identity.riot"
        label="Riot"
        :maxlength="inputLengthLimit"
        placeholder="@yourname:matrix.org"
        expanded />

      <p class="subtitle is-size-6">
        {{ $t('identity.deposit') }}
        <Money :value="deposit" inline />
      </p>

      <SubmitButton
        :label="$t('identity.click')"
        :disabled="disabled"
        :loading="isLoading"
        expanded
        @click="submit" />
    </form>
  </section>
</template>

<script lang="ts" setup>
import { notificationTypes, showNotification } from '@/utils/notification'
import { NeoField, NeoIcon, NeoInput, NeoTooltip } from '@kodadot1/brick'
import type { IdentityFields } from '@/composables/useIdentity'
import { useIdentityStore } from '@/stores/identity'

const Auth = defineAsyncComponent(() => import('@/components/shared/Auth.vue'))
const BasicInput = defineAsyncComponent(
  () => import('@/components/shared/form/BasicInput.vue')
)
const Loader = defineAsyncComponent(
  () => import('@/components/shared/Loader.vue')
)
const Money = defineAsyncComponent(
  () => import('@/components/shared/format/Money.vue')
)
const SubmitButton = defineAsyncComponent(
  () => import('@/components/base/SubmitButton.vue')
)

const { apiInstance } = useApi()
const { accountId, balance } = useAuth()
const { urlPrefix } = usePrefix()
const identityStore = useIdentityStore()
const { howAboutToExecute, isLoading, initTransactionLoader, status } =
  useMetaTransaction()
const identity = ref<IdentityFields>({})
const deposit = ref('0')
const inputLengthLimit = ref(32)

const { identity: identityData } = useIdentity({
  address: accountId,
})

watch(identityData, () => {
  const { display, legal, web, twitter, riot, email } = identityData.value
  identity.value = {
    display,
    legal,
    web,
    twitter,
    riot,
    email,
  }
})

const handleUrlPrefixChange = async () => {
  deposit.value = await fetchDeposit()

  if (Number(identityStore.getAuthBalance) === 0) {
    identityStore.fetchBalance({ address: accountId.value })
  }
}

const enhanceIdentityData = (): Record<string, any> => {
  return Object.fromEntries(
    Object.entries(identity.value)
      .filter(([, val]) => !!val)
      .map(([key, val]: [string, string]) => {
        if (val) {
          return [key, { raw: val }]
        }
        return [key, { none: null }]
      })
  )
}

const fetchDeposit = async () => {
  const api = await apiInstance.value
  return api.consts.identity?.basicDeposit?.toString()
}

const submit = async (): Promise<void> => {
  const api = await apiInstance.value
  initTransactionLoader()
  const cb = api.tx.identity.setIdentity
  const args = [enhanceIdentityData()]
  howAboutToExecute(accountId.value, cb, args, onSuccess)
}

const onSuccess = (block: string) => {
  showNotification(
    `[Identity] You are known as ${identity.value.display} since block ${block}`,
    notificationTypes.success
  )
}

const disabled = computed(
  () => Object.values(identity.value).filter((val) => val).length === 0
)

watch(
  urlPrefix,
  async () => {
    accountId.value && handleUrlPrefixChange()
  },
  { immediate: true }
)
</script>
