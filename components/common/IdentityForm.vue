<template>
  <section>
    <form @submit.prevent>
      <h1 class="title is-size-3 mb-8 is-capitalized">
        {{ $t('identity.setOn', [getChainName(identityPrefix)]) }}
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
            :label="$t('identity.clear')"
            class="mb-1"
            no-shadow
            rounded
            size="small"
            @click="deleteIdentity" />
        </div>
        <hr class="my-7" />
      </div>

      <NeoField label="Handle" class="mb-5">
        <NeoInput
          v-model="identity.display.value"
          :placeholder="$t('identity.onChainPlaceholder')"
          :maxlength="inputLengthLimit"
          required
          :validation-message="$t('identity.handleRequired')" />
      </NeoField>

      <NeoField :label="$t('name')" class="mb-5">
        <NeoInput
          v-model="identity.legal.value"
          :placeholder="$t('identity.namePlaceholder')"
          :maxlength="inputLengthLimit" />
      </NeoField>

      <NeoField :label="$t('email')" class="mb-5">
        <NeoInput
          v-model="identity.email.value"
          type="email"
          placeholder="somebody@example.com"
          :maxlength="inputLengthLimit" />
      </NeoField>

      <NeoField :label="$t('website')" class="mb-5">
        <NeoInput
          v-model="identity.web.value"
          placeholder="https://example.com"
          :maxlength="inputLengthLimit" />
      </NeoField>

      <NeoField :label="$t('Select Blockchain')">
        <div class="w-100">
          <NeoSelect v-model="selectChain" class="mt-3" expanded required>
            <option v-for="menu in menus" :key="menu.value" :value="menu.value">
              {{ menu.text }}
            </option>
          </NeoSelect>
        </div>
      </NeoField>

      <NeoField label="Any Socials?" class="mb-4">
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
        <NeoField
          v-if="isTabVisible(IdentitySocialField.Twitter)"
          label="Twitter"
          class="mb-4">
          <NeoInput
            v-model="identity.twitter.value"
            placeholder="@YourTwitterName"
            :maxlength="inputLengthLimit" />
        </NeoField>
      </Transition>

      <hr />

      <p class="subtitle is-size-6">
        {{ $t('identity.deposit') }}
        <Money :value="deposit" :unit-symbol="identityUnit" inline />

        <NeoTooltip
          :label="$t('identity.fundsReserve', [depositFormatted])"
          position="right"
          multiline>
          <NeoIcon icon="fa-info-circle" pack="fa-regular" class="ml-2" />
        </NeoTooltip>
      </p>

      <NeoButton
        class="is-flex is-flex-grow-1 fixed-height"
        variant="k-accent"
        :label="$t('identity.create')"
        :disabled="disabled"
        :loading="isLoading"
        expanded
        @click="openConfirmModal" />
    </form>

    <IdentityConfirmModal
      v-model="isConfirmModalActive"
      :deposit="depositFormatted"
      :deposit-usd="depositUsd"
      :identity="identity"
      :identity-active-socials="activeSocials"
      :is-mobile="isMobile"
      @confirm="setIdentity"
      @close="isConfirmModalActive = false" />

    <TransactionLoader
      v-model="isLoaderModalVisible"
      :status="status"
      :transaction-id="transactionValue"
      :is-mobile="isMobile"
      @close="isLoaderModalVisible = false">
      <template #action-title>
        <span>{{
          $t(isClearingIdentity ? 'identity.clearing' : 'identity.create')
        }}</span>
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
  NeoSelect,
} from '@kodadot1/brick'
import PillTabs, { Icon, PillTab } from '@/components/shared/PillTabs.vue'
import IdentityConfirmModal from '@/components/common/identity/IdentityConfirmModal.vue'
import TransactionLoader from '@/components/shared/TransactionLoader.vue'
import { useIdentityStore } from '@/stores/identity'
import Money from '@/components/shared/format/Money.vue'
import { useFiatStore } from '@/stores/fiat'
import { calculateUsdFromToken } from '@/utils/calculation'
import format from '@/utils/format/balance'
import { availablePrefixes } from '@/utils/chain'

const { $i18n } = useNuxtApp()

const { accountId } = useAuth()
const { decimals } = useChain()
const { urlPrefix, setUrlPrefix } = usePrefix()
const { fetchFiatPrice, getCurrentTokenValue } = useFiatStore()
const identityStore = useIdentityStore()
const { howAboutToExecute, isLoading, initTransactionLoader, status } =
  useMetaTransaction()

export type IdentityField = {
  label: string
  value: string
  icon?: Icon
  isSocial?: boolean
}

enum IdentitySocialField {
  Twitter = 'twitter',
}

export type IdentityForm = Record<string, IdentityField>

const identity = ref<IdentityForm>({
  display: {
    label: $i18n.t('handle'),
    value: '',
  },
  legal: {
    label: $i18n.t('name'),
    value: '',
  },
  email: {
    label: $i18n.t('email'),
    value: '',
  },
  web: {
    label: $i18n.t('website'),
    value: '',
  },
  [IdentitySocialField.Twitter]: {
    label: 'Twitter',
    icon: { name: 'fa-x-twitter', pack: 'fa-brands' },
    isSocial: true,
    value: '',
  },
})

const socialTabs = ref<PillTab[]>([
  {
    label: identity.value[IdentitySocialField.Twitter].label,
    icon: identity.value[IdentitySocialField.Twitter].icon,
    value: IdentitySocialField.Twitter,
  },
])

const deposit = ref('0')
const inputLengthLimit = ref(32)
const isClearingIdentity = ref(false)

const {
  identity: identityData,
  identityApi,
  identityPrefix,
  identityUnit,
  refetchIdentity,
} = useIdentity({
  address: accountId,
})

const isConfirmModalActive = ref(false)
const isLoaderModalVisible = ref(false)
const transactionValue = ref('')

const menus = availablePrefixes().filter(
  (menu) => menu.value !== 'movr' && menu.value !== 'glmr',
)
const chainByPrefix = computed(() =>
  menus.find((menu) => menu.value === urlPrefix.value),
)
const selectChain = ref(chainByPrefix.value?.value || menus[0].value)

watch(urlPrefix, (value) => {
  selectChain.value = value
})
const currentChain = computed(() => selectChain.value as Prefix)
watch(currentChain, () => {
if (currentChain.value !== urlPrefix.value) {
    setUrlPrefix(currentChain.value as Prefix)
  }
})

const activeSocials = computed(() => {
  return socialTabs.value.reduce(
    (reducer, tab) => ({ ...reducer, [tab.value]: tab.active }),
    {},
  )
})

const isMobile = computed(() => useWindowSize().width.value <= 764)
const disabled = computed(
  () => identity.value.display.value === '' || isLoading.value,
)

const depositFormatted = computed(() =>
  format(deposit.value, decimals.value, identityUnit.value),
)

const currentTokenValue = computed(() =>
  getCurrentTokenValue(identityUnit.value),
)
const depositUsd = computed(() => {
  const value = calculateUsdFromToken(
    Number(deposit.value) * Math.pow(10, -decimals.value),
    Number(currentTokenValue.value),
  )
  return `$${value}`
})

const isTabVisible = (value: IdentitySocialField) => {
  return socialTabs.value.find((tab) => tab.value === value)?.active
}

const openConfirmModal = () => {
  isConfirmModalActive.value = true
}

watch(identityData, () => {
  const { display, legal, web, twitter, email } = identityData.value
  setIdentityValue({ display, legal, web, twitter, email })
})

const setIdentityValue = (values: Record<string, string>) => {
  identity.value = Object.keys(values).reduce((reducer, field) => {
    return {
      ...reducer,
      [field]: {
        ...identity.value[field],
        value: values[field] || '',
      },
    }
  }, identity.value)
}

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
      .filter(([, field]) => !!field.value)
      .map(([key, field]: [string, IdentityField]) => {
        if (field.value) {
          return [key, { raw: field.value }]
        }
        return [key, { none: null }]
      }),
  )
}

const fetchDeposit = async () => {
  const api = await identityApi.value
  return api.consts.identity?.basicDeposit?.toString()
}

const deleteIdentity = async (): Promise<void> => {
  const api = await identityApi.value
  isClearingIdentity.value = true
  initTransactionLoader()
  const cb = api.tx.identity.clearIdentity
  howAboutToExecute(accountId.value, cb, [], (block: string) => {
    identity.value = {}
    refetchIdentity()

    showNotification(
      `[Identity] You have cleared your account's identity since block ${block}`,
      notificationTypes.success,
    )
  })
}

const setIdentity = async (): Promise<void> => {
  isConfirmModalActive.value = false
  const api = await identityApi.value
  isClearingIdentity.value = false
  initTransactionLoader()
  const cb = api.tx.identity.setIdentity
  const args = [enhanceIdentityData()]
  howAboutToExecute(
    accountId.value,
    cb,
    args,
    (block: string) => {
      showNotification(
        `[Identity] You are known as ${identity.value.display} since block ${block}`,
        notificationTypes.success,
      )
    },
    onError,
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

const socialCheck = {
  [IdentitySocialField.Twitter]: isValidTwitterHandle,
}

const isValidSocial = (
  socialIdentityKey: IdentitySocialField,
  value?: string,
) => {
  return socialCheck[socialIdentityKey](value || '')
}

onMounted(fetchFiatPrice)

watch(
  identity,
  (value, prevValue) => {
    if (value) {
      socialTabs.value = socialTabs.value.map((tab) => {
        const socialIdentityFieldValue = value[tab.value].value
        const prevSocialIdentityFieldValue = prevValue[tab.value].value
        const isInit = prevSocialIdentityFieldValue === ''
        return {
          ...tab,
          active: (isInit && Boolean(socialIdentityFieldValue)) || tab.active,
          ticked: isValidSocial(
            tab.value as IdentitySocialField,
            socialIdentityFieldValue,
          ),
        }
      })
    }
  },
  { deep: true },
)

watch(socialTabs, (tabs) => {
  tabs.forEach((tab) => {
    if (!tab.active && identity.value[tab.value]) {
      identity.value[tab.value].value = ''
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
  { immediate: true },
)
</script>
<style lang="scss" scoped>
.fixed-height {
  height: 3.188rem !important;
}
</style>
