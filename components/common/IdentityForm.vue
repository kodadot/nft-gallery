<template>
  <section>
    <Loader v-model="isLoading" :status="status" />
    <form @submit.prevent>
      <h1 class="title is-size-3 is-capitalized">
        {{ $i18n.t('identity.set', [getChainName(identityPrefix)]) }}
      </h1>

      <div v-if="hasIdentity" class="is-size-6">
        <hr class="my-7" />
        <div class="mb-4">
          {{ $t('identity.establishedIdentity') }}
        </div>
        <div
          class="is-flex is-justify-content-space-between is-align-items-flex-end">
          <div
            class="is-flex is-justify-content-space-between is-align-items-center">
            <Avatar :value="accountId" :size="34" />
            <div class="ml-4">
              <div class="has-text-grey">{{ $t('identity.existing') }}</div>
              <div>{{ identityData.display }}</div>
            </div>
          </div>
          <NeoButton
            :label="$i18n.t('identity.clear')"
            variant="text"
            class="border-k-shade border-radius mb-1"
            no-shadow
            @click.native="submit(true)" />
        </div>
        <hr class="my-7" />
      </div>

      <NeoField label="Handle">
        <NeoInput
          v-model="identity.display"
          :placeholder="$i18n.t('identity.onChainPlaceholder')"
          :maxlength="inputLengthLimit"
          required
          :validation-message="$i18n.t('identity.handleRequired')" />
      </NeoField>

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
        :label="$i18n.t('Email')"
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
        {{ $i18n.t('identity.deposit') }}
        <Money :value="deposit" inline />
      </p>

      <SubmitButton
        :label="$i18n.t('identity.click')"
        :disabled="disabled"
        :loading="isLoading"
        expanded
        @click="submit()" />
    </form>
  </section>
</template>

<script lang="ts" setup>
import { notificationTypes, showNotification } from '@/utils/notification'
import {
  NeoButton,
  NeoField,
  NeoIcon,
  NeoInput,
  NeoTooltip,
} from '@kodadot1/brick'
import type { IdentityFields } from '@/composables/useIdentity'
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

const { $i18n } = useNuxtApp()
import { useIdentityStore } from '@/stores/identity'
import { getChainName } from '@/utils/chain'

const { accountId, balance } = useAuth()
const { urlPrefix } = usePrefix()
const identityStore = useIdentityStore()
const { howAboutToExecute, isLoading, initTransactionLoader, status } =
  useMetaTransaction()
const identity = ref<IdentityFields>({})
const deposit = ref('0')
const inputLengthLimit = ref(32)

const {
  identity: identityData,
  identityApi,
  identityPrefix,
  refetchIdentity,
} = useIdentity({
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

const hasIdentity = computed(() => {
  const { display, legal, web, twitter, riot, email } = identityData.value
  return (
    accountId.value &&
    Boolean(display || legal || web || twitter || riot || email)
  )
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
  const api = await identityApi.value
  return api.consts.identity?.basicDeposit?.toString()
}

const submit = async (isDelete?: boolean): Promise<void> => {
  const api = await identityApi.value
  initTransactionLoader()
  const cb = isDelete
    ? api.tx.identity.clearIdentity
    : api.tx.identity.setIdentity
  const args = isDelete ? [] : [enhanceIdentityData()]
  howAboutToExecute(accountId.value, cb, args, (block: string) => {
    if (isDelete) {
      identity.value = {}
      refetchIdentity()
    }
    showNotification(
      isDelete
        ? `[Identity] You have cleared your account's identity since block ${block}`
        : `[Identity] You are known as ${identity.value.display} since block ${block}`,
      notificationTypes.success
    )
  })
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
<style scoped>
.border-radius {
  border-radius: 6rem;
}
</style>
