<template>
  <NeoTooltip multiline-width="256px" :position="position" multiline>
    <NeoIcon icon="fa-info-circle" pack="fa-regular" class="ml-2" />

    <template #content>
      <div class="is-flex is-size-6 mb-2">
        <NeoIcon icon="fa-info-circle" pack="fa-regular" class="mr-2" />

        <span class="has-text-weight-bold">{{
          $t('autoTeleport.autoTeleport')
        }}</span>
      </div>

      <p class="has-text-left mb-2">{{ $t('autoTeleport.tooltip.first') }}</p>
      <p class="has-text-left mb-2">{{ $t('autoTeleport.tooltip.second') }}</p>

      <p class="has-text-weight-bold has-text-left mb-2">
        {{ $t('autoTeleport.tooltip.optimalTransferPath') }}
      </p>

      <div v-if="transition.source" class="w-full">
        <div class="is-flex is-justify-content-space-between mb-2">
          <span>{{ transition.source.name }}</span>

          <span> -> </span>

          <span>
            <span>{{ transition.destination.name }} </span>
            <span class="has-text-k-grey"> ({{ transition.token }}) </span>
          </span>
        </div>

        <div class="is-flex is-justify-content-space-between">
          <span class="has-text-k-grey">{{ $t('amount') }}</span>

          <span
            >{{ transition.amountFormatted }} ~ {{ transition.amountUsd }}</span
          >
        </div>
      </div>
      <div v-else>
        <p class="mb-2 has-text-k-grey has-text-left">
          {{ $t('autoTeleport.tooltip.noRouteFound') }}
        </p>
      </div>

      <div class="is-flex is-justify-content-start mt-4">
        <a
          class="has-text-link is-size-7"
          target="_blank"
          rel="nofollow noopener noreferrer"
          >Learn more</a
        >
      </div>
    </template>
  </NeoTooltip>
</template>

<script setup lang="ts">
import { NeoIcon, NeoTooltip } from '@kodadot1/brick'

defineProps<{
  transition: TeleportTransition
  position: string
}>()
</script>
