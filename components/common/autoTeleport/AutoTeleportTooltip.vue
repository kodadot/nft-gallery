<template>
    <NeoTooltip size="large" position="top" multiline>
        <NeoIcon icon="fa-info-circle" pack="fa-regular" class="ml-2" />

        <template #content>
            <div class="is-flex">
                <NeoIcon icon="fa-info-circle" pack="fa-regular" class="mr-2" />

                <span>{{ $t('autoTeleport.autoTeleport') }}</span>
            </div>

            <p>{{ $t('autoTeleport.tooltip.first') }}</p>
            <p>{{ $t('autoTeleport.tooltip.second') }}</p>

            <p class="has-text-weight-bold">{{ $t('autoTeleport.tooltip.optimalTransferPath') }}</p>

            <div v-if="transition?.source" class="w-full">
                <div class="is-flex is-justify-items-space-between">
                    <span>{{ transition.source.name }}</span>

                    <span> -> </span>

                    <span>{{ transition.destination.name }} ({{ transition.token }})</span>
                </div>

                <div class="is-flex is-justify-items-space-between">
                    <span>{{ $t('amount') }}</span>

                    <span>{{ transition.amountFormatted }} ~ {{ transition.amountUsd }}</span>
                </div>

            </div>

        </template>
    </NeoTooltip>
</template>

<script setup lang="ts">
import { NeoTooltip, NeoIcon } from "@kodadot1/brick"

defineProps<{
    transition: TeleportTransition | null
}>()

</script>

<style scoped></style>