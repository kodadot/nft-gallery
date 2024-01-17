<template>
  <NeoTooltip :label="parsedDate" position="top">
    <span :class="customClass">{{ timeAgoStr }}</span>
  </NeoTooltip>
</template>

<script lang="ts" setup>
import { NeoTooltip } from '@kodadot1/brick'
import { timeAgo } from '@/components/collection/utils/timeAgo'
import { parseDate } from '@/utils/datetime'

const props = defineProps<{
  timestamp: number
  customClass?: string
}>()

const timestampProp = computed(() => props.timestamp)

const timeAgoStr = computed(() => timeAgo(timestampProp.value))
const parsedDate = computed(() => parseDate(timestampProp.value))
</script>
