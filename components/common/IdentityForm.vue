<template>
  <section>
    <form @submit.prevent>
      <h1 class="title is-size-3 mb-8 is-capitalized">
        {{ $i18n.t('identity.set', [chainName]) }}
      </h1>

      <NeoField :label="`${$i18n.t('handle')} *`" class="mb-5">
        <NeoInput
          v-model="identity.display"
          :placeholder="$i18n.t('identity.onChainPlaceholder')"
          :maxlength="inputLengthLimit"
          required
          :validation-message="$i18n.t('identity.handleRequired')" />
      </NeoField>

      <BasicInput
        v-model="identity.legal"
        class="mb-4"
        :label="$i18n.t('name')"
        :maxlength="inputLengthLimit"
        :placeholder="$i18n.t('identity.namePlaceholder')"
        expanded />

      <BasicInput
        v-model="identity.email"
        type="email"
        class="mb-5"
        :maxlength="inputLengthLimit"
        :label="$i18n.t('email')"
        placeholder="somebody@example.com"
        expanded />

      <BasicInput
        v-model="identity.web"
        class="mb-4"
        :label="$i18n.t('website')"
        :maxlength="inputLengthLimit"
        placeholder="https://example.com"
        expanded />

      <NeoField label="Any Socials?" class="mb-5">
        <div class="is-flex is-flex-direction-column">
          <p>{{ $t('identity.socialsDescription') }}</p>

          <PillTabs
            class="mt-4"
            :tabs="socialTabs"
            show-selected
            @select="handleSocialSelect" />
        </div>
      </NeoField>

      <Transition name="fade">
        <BasicInput
          v-if="isTabVisible(IdentitySocialField.Twitter)"
          v-model="identity.twitter"
          class="mb-4"
          label="Twitter"
          :maxlength="inputLengthLimit"
          placeholder="@YourTwitterName"
          expanded />
      </Transition>

      <Transition name="fade">
        <BasicInput
          v-if="isTabVisible(IdentitySocialField.Riot)"
          v-model="identity.riot"
          class="mb-4"
          label="Riot"
          :maxlength="inputLengthLimit"
          placeholder="@yourname:matrix.org"
          expanded />
      </Transition>

      <hr />

      <p class="subtitle is-size-6">
        {{ $i18n.t('identity.deposit') }}
        <Money :value="deposit" inline />

        <NeoTooltip
          :label="$i18n.t('identity.fundsReserve', [depositFormatted])"
          position="right"
          multiline>
          <NeoIcon icon="fa-info-circle" pack="fa-regular" class="ml" />
        </NeoTooltip>
      </p>

      <NeoButton
        class="fixed-button-height is-flex is-flex-1"
        variant="k-accent"
        size="medium"
        :label="$t('identity.create')"
        :disabled="disabled"
        :loading="isLoading"
        expanded
        @click.native="openConfirmModal" />
    </form>

    <IdentityConfirmModal
      v-model="isConfirmModalActive"
      :deposit="depositFormatted"
      :deposit-usd="depositUsd"
      :identity="identity"
      :socials="socialTabs"
      :is-mobile="isMobile"
      @confirm="submit"
      @close="isConfirmModalActive = false" />

    <TransactionLoader
      v-model="isLoaderModalVisible"
      :status="status"
      :transaction-id="transactionValue"
      :is-mobile="isMobile"
      @close="isLoaderModalVisible = false">
      <template #action-title>
        <span>{{ $t('identity.create') }}</span>
      </template>
    </TransactionLoader>
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
import PillTabs, { PillTab } from '@/components/shared/PillTabs.vue'
import IdentityConfirmModal from '@/components/common/identity/IdentityConfirmModal.vue'
import TransactionLoader from '@/components/shared/TransactionLoader.vue'
import { useIdentityStore } from '@/stores/identity'
import BasicInput from '@/components/shared/form/BasicInput.vue'
import Money from '@/components/shared/format/Money.vue'
import { useFiatStore } from '@/stores/fiat'
import { calculateUsdFromToken } from '@/utils/calculation'
import format from '@/utils/format/balance'

const { $i18n } = useNuxtApp()
const { apiInstance } = useApi()
const { accountId } = useAuth()
const { decimals, unit, name: chainName } = useChain()
const { urlPrefix } = usePrefix()
const { fetchFiatPrice, getCurrentTokenValue } = useFiatStore()
const identityStore = useIdentityStore()
const { identity: identityData } = useIdentity({
  address: accountId,
})
const { howAboutToExecute, isLoading, initTransactionLoader, status } =
  useMetaTransaction()

const identity = ref<IdentityFields>({})
const deposit = ref('0')
const inputLengthLimit = ref(32)

const isConfirmModalActive = ref(false)
const isLoaderModalVisible = ref(false)
const transactionValue = ref('')

enum IdentitySocialField {
  Riot = 'riot',
  Twitter = 'twitter',
}

const socialTabs = ref<PillTab[]>([
  {
    label: 'Riot',
    value: IdentitySocialField.Riot,
  },
  {
    label: 'Twitter',
    icon: { name: 'fa-x-twitter', pack: 'fa-brands' },
    value: IdentitySocialField.Twitter,
  },
])

const isMobile = computed(() => useWindowSize().width.value <= 764)
const disabled = computed(
  () => identity.value.display === '' || isLoading.value
)

const depositFormatted = computed(() =>
  format(deposit.value, decimals.value, unit.value)
)

const currentTokenValue = computed(() => getCurrentTokenValue(unit.value))
const depositUsd = computed(() => {
  const value = calculateUsdFromToken(
    Number(deposit.value) * Math.pow(10, -decimals.value),
    Number(currentTokenValue.value)
  )
  return `$${value}`
})

const isTabVisible = (value: IdentitySocialField) => {
  return socialTabs.value.find((tab) => tab.value === value)?.active
}

const openConfirmModal = () => {
  isConfirmModalActive.value = true
}

const submit = async (): Promise<void> => {
  isConfirmModalActive.value = false
  const api = await apiInstance.value
  initTransactionLoader()
  const cb = api.tx.identity.setIdentity
  const args = [enhanceIdentityData()]
  howAboutToExecute(accountId.value, cb, args, onSuccess, onError)
}

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

const onSuccess = (block: string) => {
  showNotification(
    `[Identity] You are known as ${identity.value.display} since block ${block}`,
    notificationTypes.success
  )
}

const onError = () => {
  isLoaderModalVisible.value = false
}

const handleSocialSelect = (value: string) => {
  socialTabs.value = socialTabs.value.map((tab) => {
    if (tab.value !== value) {
      return tab
    }
    return { ...tab, active: !tab.active }
  })
}

const isValidTwitterHandle = (handle: string) => {
  const pattern = /^@\w{1,15}$/
  return pattern.test(handle)
}

const isValidRiotHandle = (handle: string) => {
  const pattern = /^@[A-Za-z0-9]+:matrix\.org$/
  return pattern.test(handle)
}

const socialCheck = {
  [IdentitySocialField.Riot]: isValidRiotHandle,
  [IdentitySocialField.Twitter]: isValidTwitterHandle,
}

const isValidSocial = (
  socialIdentityKey: IdentitySocialField,
  value?: string
) => {
  return socialCheck[socialIdentityKey](value || '')
}

onMounted(fetchFiatPrice)

watch(
  identity,
  (value, prevValue) => {
    if (value) {
      socialTabs.value = socialTabs.value.map((tab) => {
        const socialIdentityFieldValue = value[tab.value]
        const prevSocialIdentityFieldValue = prevValue[tab.value]
        const isInit = prevSocialIdentityFieldValue === undefined
        return {
          ...tab,
          active: (isInit && Boolean(socialIdentityFieldValue)) || tab.active,
          ticked: isValidSocial(
            tab.value as IdentitySocialField,
            socialIdentityFieldValue
          ),
        }
      })
    }
  },
  { deep: true }
)

watch(socialTabs, (tabs) => {
  tabs.forEach((tab) => {
    if (!tab.active && identity.value[tab.value]) {
      identity.value[tab.value] = ''
    }
  })
})

watch(isLoading, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    isLoaderModalVisible.value = isLoading.value
  }
})

watch(
  urlPrefix,
  async () => {
    accountId.value && handleUrlPrefixChange()
  },
  { immediate: true }
)
</script>
