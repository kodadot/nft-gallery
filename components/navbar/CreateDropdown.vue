<template>
  <div>
    <b-dropdown v-if="!isMobile" aria-role="list" :triggers="['click']">
      <template #trigger>
        <div class="navbar-item">
          {{ $t('create') }}
        </div>
      </template>
      <b-dropdown-item has-link>
        <NeoTooltip
          v-if="chain !== 'stmn'"
          position="left"
          full-width
          :label="$t('createDropdown.start')"
          multiline>
          <nuxt-link data-cy="classic" :to="`/${urlPrefix}/create`">
            {{ $t('classic') }}
          </nuxt-link>
        </NeoTooltip>
      </b-dropdown-item>

      <b-dropdown-item has-link>
        <NeoTooltip
          v-if="chain === 'stmn'"
          full-width
          position="left"
          :label="$t('createDropdown.waifu')"
          multiline>
          <nuxt-link data-cy="waifu" :to="`/${urlPrefix}/waifu`">
            {{ $t('navbar.create.waifu') }}
          </nuxt-link>
        </NeoTooltip>
      </b-dropdown-item>
      <template v-if="chain === 'rmrk'">
        <b-dropdown-item has-link>
          <NeoTooltip
            position="left"
            full-width
            :label="$t('createDropdown.simplifiedNft')"
            multiline>
            <nuxt-link data-cy="simple" :to="`/${urlPrefix}/mint`">
              {{ $t('simple') }}
            </nuxt-link>
          </NeoTooltip>
        </b-dropdown-item>
      </template>
      <b-dropdown-item v-if="redesign" has-link>
        <NeoTooltip
          position="left"
          full-width
          :label="$t('createDropdown.massmint')"
          multiline>
          <nuxt-link data-cy="massmint" :to="`/${urlPrefix}/massmint`">
            {{ $t('multipleNFTS') }}
          </nuxt-link>
        </NeoTooltip>
      </b-dropdown-item>
    </b-dropdown>

    <MobileExpandableSection v-else :no-padding="true" :title="$t('create')">
      <b-navbar-item
        v-if="chain !== 'stmn'"
        data-cy="classic"
        :to="`/${urlPrefix}/create`"
        tag="nuxt-link">
        {{ $t('classic') }}
      </b-navbar-item>
      <b-navbar-item
        v-if="chain === 'stmn'"
        data-cy="waifu"
        :to="`/${urlPrefix}/waifu`"
        tag="nuxt-link">
        {{ $t('waifu') }}
      </b-navbar-item>
      <template v-if="chain === 'rmrk'">
        <b-navbar-item
          data-cy="simple"
          :to="`/${urlPrefix}/mint`"
          tag="nuxt-link">
          {{ $t('simple') }}
        </b-navbar-item>
      </template>
      <b-navbar-item
        v-if="redesign"
        data-cy="massmint"
        :to="`/${urlPrefix}/massmint`"
        tag="nuxt-link">
        {{ $t('multipleNFTS') }}
      </b-navbar-item>
    </MobileExpandableSection>
  </div>
</template>

<script lang="ts" setup>
import { NeoTooltip } from '@kodadot1/brick'

import MobileExpandableSection from '@/components/navbar/MobileExpandableSection.vue'

defineProps<{
  chain: string
  isMobile: boolean
}>()

const { urlPrefix } = usePrefix()
const { accountId } = useAuth()
const { redesign } = useExperiments()
</script>
