<template>
  <div>
    <NeoDropdown v-if="!isMobile" aria-role="list" :triggers="['click']">
      <template #trigger>
        <div class="navbar-item">
          {{ $t('create') }}
        </div>
      </template>

      <NeoDropdownItem>
        <NeoTooltip
          position="left"
          full-width
          :label="$t('createDropdown.start')"
          multiline>
          <nuxt-link
            data-testid="classic"
            :to="`/${urlPrefix}/create`"
            tag="div">
            {{ $t('classic') }}
          </nuxt-link>
        </NeoTooltip>
      </NeoDropdownItem>

      <NeoDropdownItem v-if="chain === 'ahk'">
        <NeoTooltip
          position="left"
          :label="$t('createDropdown.waifu')"
          multiline>
          <nuxt-link data-testid="waifu" :to="`/${urlPrefix}/waifu`" tag="div">
            {{ $t('navbar.create.waifu') }}
          </nuxt-link>
        </NeoTooltip>
      </NeoDropdownItem>

      <NeoDropdownItem>
        <NeoTooltip
          position="left"
          full-width
          :label="$t('createDropdown.massmint')"
          multiline>
          <nuxt-link
            data-testid="massmint"
            :to="`/${urlPrefix}/massmint`"
            tag="div">
            {{ $t('multipleNFTS') }}
          </nuxt-link>
        </NeoTooltip>
      </NeoDropdownItem>
    </NeoDropdown>

    <MobileExpandableSection v-else :no-padding="true" :title="$t('create')">
      <nuxt-link
        class="navbar-item"
        data-testid="classic"
        :to="`/${urlPrefix}/create`"
        @click.native="emit('closeMobileNavbar')">
        {{ $t('classic') }}
      </nuxt-link>
      <nuxt-link
        v-if="chain === 'ahk'"
        class="navbar-item"
        data-testid="waifu"
        :to="`/${urlPrefix}/waifu`"
        @click.native="emit('closeMobileNavbar')">
        {{ $t('waifu') }}
      </nuxt-link>
      <template v-if="chain === 'rmrk'">
        <nuxt-link
          class="navbar-item"
          data-testid="simple"
          :to="`/${urlPrefix}/mint`"
          @click.native="emit('closeMobileNavbar')">
          {{ $t('simple') }}
        </nuxt-link>
      </template>
      <nuxt-link
        class="navbar-item"
        data-testid="massmint"
        :to="`/${urlPrefix}/massmint`"
        @click.native="emit('closeMobileNavbar')">
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
const emit = defineEmits(['closeMobileNavbar'])
</script>
