<template>
  <div>
    <NeoDropdown v-if="!isMobile" aria-role="list" :triggers="['click']">
      <template #trigger>
        <div class="navbar-item">
          {{ $t('create') }}
        </div>
      </template>

      <NeoDropdownItem v-if="chain !== 'stmn'">
        <NeoTooltip
          position="left"
          full-width
          :label="$t('createDropdown.start')"
          multiline>
          <nuxt-link data-cy="classic" :to="`/${urlPrefix}/create`" tag="div">
            {{ $t('classic') }}
          </nuxt-link>
        </NeoTooltip>
      </NeoDropdownItem>

      <NeoDropdownItem v-if="chain === 'stmn'">
        <NeoTooltip
          position="left"
          :label="$t('createDropdown.waifu')"
          multiline>
          <nuxt-link data-cy="waifu" :to="`/${urlPrefix}/waifu`" tag="div">
            {{ $t('navbar.create.waifu') }}
          </nuxt-link>
        </NeoTooltip>
      </NeoDropdownItem>

      <template v-if="chain === 'rmrk'">
        <NeoDropdownItem>
          <NeoTooltip
            position="left"
            full-width
            :label="$t('createDropdown.simplifiedNft')"
            multiline>
            <nuxt-link data-cy="simple" :to="`/${urlPrefix}/mint`" tag="div">
              {{ $t('simple') }}
            </nuxt-link>
          </NeoTooltip>
        </NeoDropdownItem>
      </template>
      <NeoDropdownItem>
        <NeoTooltip
          position="left"
          full-width
          :label="$t('createDropdown.massmint')"
          multiline>
          <nuxt-link
            data-cy="massmint"
            :to="`/${urlPrefix}/massmint`"
            tag="div">
            {{ $t('multipleNFTS') }}
          </nuxt-link>
        </NeoTooltip>
      </NeoDropdownItem>
    </NeoDropdown>

    <MobileExpandableSection v-else :no-padding="true" :title="$t('create')">
      <nuxt-link
        v-if="chain !== 'stmn'"
        class="navbar-item"
        data-cy="classic"
        :to="`/${urlPrefix}/create`">
        {{ $t('classic') }}
      </nuxt-link>
      <nuxt-link
        v-if="chain === 'stmn'"
        class="navbar-item"
        data-cy="waifu"
        :to="`/${urlPrefix}/waifu`">
        {{ $t('waifu') }}
      </nuxt-link>
      <template v-if="chain === 'rmrk'">
        <nuxt-link
          class="navbar-item"
          data-cy="simple"
          :to="`/${urlPrefix}/mint`">
          {{ $t('simple') }}
        </nuxt-link>
      </template>
      <nuxt-link
        class="navbar-item"
        data-cy="massmint"
        :to="`/${urlPrefix}/massmint`">
        {{ $t('multipleNFTS') }}
      </nuxt-link>
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
</script>
