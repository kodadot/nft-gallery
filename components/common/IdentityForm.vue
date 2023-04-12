<template>
  <section>
    <Loader v-model="isLoading" :status="status" />
    <form>
      <p class="title is-size-3">
        {{ $i18n.t('identity.set') }}
        <b-tooltip
          :label="$i18n.t('identity.fundsReserve')"
          position="is-bottom">
          <b-icon icon="info-circle" />
        </b-tooltip>
      </p>

      <p v-if="accountId" class="subtitle is-size-6">
        <Auth />
        <span>{{ $i18n.t('general.balance') }}: </span>
        <Money :value="balance" inline />
      </p>

      <b-field label="Handle">
        <b-input
          v-model="identity.display"
          :placeholder="$i18n.t('identity.onChainPlaceholder')"
          :maxlength="inputLengthLimit"
          required
          :validation-message="$i18n.t('identity.handleRequired')">
        </b-input>
      </b-field>

      <BasicInput
        v-model="identity.legal"
        :label="$i18n.t('name')"
        :maxlength="inputLengthLimit"
        :placeholder="$i18n.t('identity.namePlaceholder')"
        expanded />

      <BasicInput
        v-model="identity.email"
        type="email"
        :maxlength="inputLengthLimit"
        :label="$i18n.t('email')"
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
        v-model="identity.discord"
        label="Discord"
        :maxlength="inputLengthLimit"
        placeholder="Discord UserName#0000"
        expanded />

      <BasicInput
        v-model="identity.riot"
        label="Riot"
        :maxlength="inputLengthLimit"
        placeholder="@yourname:matrix.org"
        expanded />

      <p class="subtitle is-size-6">
        {{ $i18n.t('identity.deposit') }} <Money :value="deposit" inline />
      </p>

      <SubmitButton
        :label="$i18n.t('identity.click')"
        :disabled="disabled"
        :loading="isLoading"
        expanded
        @click="submit" />
    </form>
  </section>
</template>

<script lang="ts" setup>
import { notificationTypes, showNotification } from '@/utils/notification'
import { onApiConnect } from '@kodadot1/sub-api'
import { hexToString, isHex } from '@polkadot/util'
import { Data } from '@polkadot/types'
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

type IdentityFields = Record<string, string>

const { $store, $i18n } = useNuxtApp()
const { apiUrl, apiInstance } = useApi()
const { urlPrefix } = usePrefix()
const { accountId } = useAuth()
const { howAboutToExecute, isLoading, initTransactionLoader, status } =
  useMetaTransaction()
const identity = ref<Record<string, string>>({
  display: '',
  email: '',
  web: '',
  twitter: '',
  discord: '',
  riot: '',
  legal: '',
})
const deposit = ref('0')

const inputLengthLimit = ref(32)

onBeforeMount(async () => {
  onApiConnect(apiUrl.value, async (api) => {
    deposit.value = api.consts.identity?.basicDeposit?.toString()
    identity.value = await fetchIdentity(accountId.value)
  })
})

const enhanceIdentityData = (): Record<string, any> => {
  return Object.fromEntries(
    Object.entries(identity.value).map(([key, val]: [string, string]) => {
      if (val) {
        return [key, { raw: val }]
      }
      return [key, { none: null }]
    })
  )
}

const handleRaw = (display: Data): string => {
  if (display?.isRaw) {
    return display.asRaw.toHuman() as string
  }

  if (isHex((display as any)?.Raw)) {
    return hexToString((display as any)?.Raw)
  }

  return display?.toString()
}

const fetchIdentity = async (address: string): Promise<IdentityFields> => {
  const api = await apiInstance.value
  const optionIdentity = await api?.query.identity?.identityOf(address)
  const identity = optionIdentity?.unwrapOrDefault()
  const final = Array.from(identity?.info || {})
    .filter(([, value]) => !Array.isArray(value) && !value.isEmpty)
    .reduce((acc, [key, value]) => {
      acc[key] = handleRaw(value as unknown as Data)
      return acc
    }, {} as IdentityFields)

  return final
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

const balance = computed(() => $store.getters.getAuthBalance)

const disabled = computed(
  () => Object.values(identity.value).filter((val) => val).length === 0
)
</script>
