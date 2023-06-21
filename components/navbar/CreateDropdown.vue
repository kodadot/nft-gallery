<template>
  <div>
    <NeoDropdown v-if="!isMobile" aria-role="list" :triggers="['click']">
      <template #trigger>
        <div class="navbar-item">
          {{ $t('create') }}
        </div>
      </template>

      <NeoDropdownItem v-if="chain !== 'stmn'" has-link>
        <NeoTooltip
          position="left"
          :label="$t('createDropdown.start')"
          multiline>
          <nuxt-link data-cy="classic" :to="`/${urlPrefix}/create`">
            {{ $t('classic') }}
          </nuxt-link>
        </NeoTooltip>
      </NeoDropdownItem>

      <NeoDropdownItem v-if="chain === 'stmn'" has-link>
        <NeoTooltip
          position="left"
          :label="$t('createDropdown.waifu')"
          multiline>
          <nuxt-link data-cy="waifu" :to="`/${urlPrefix}/waifu`">
            {{ $t('navbar.create.waifu') }}
          </nuxt-link>
        </NeoTooltip>
      </NeoDropdownItem>

      <template v-if="chain === 'rmrk'">
        <NeoDropdownItem has-link>
          <NeoTooltip
            position="left"
            :label="$t('createDropdown.simplifiedNft')"
            multiline>
            <nuxt-link data-cy="simple" :to="`/${urlPrefix}/mint`">
              {{ $t('simple') }}
            </nuxt-link>
          </NeoTooltip>
        </NeoDropdownItem>
      </template>
      <NeoDropdownItem v-if="redesign" has-link>
        <NeoTooltip
          position="left"
          :label="$t('createDropdown.massmint')"
          multiline>
          <nuxt-link data-cy="massmint" :to="`/${urlPrefix}/massmint`">
            {{ $t('multipleNFTS') }}
          </nuxt-link>
        </NeoTooltip>
      </NeoDropdownItem>
    </NeoDropdown>

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
import { NeoDropdown, NeoDropdownItem, NeoTooltip } from '@kodadot1/brick'

import MobileExpandableSection from '@/components/navbar/MobileExpandableSection.vue'

defineProps<{
  chain: string
  isMobile: boolean
}>()

const { urlPrefix } = usePrefix()
const { redesign } = useExperiments()
</script>
