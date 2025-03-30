<template>
  <div class="flex justify-between">
    <div>
      <KIcon
        :name="icon.name"
        :class="['text-lg', icon.class]"
      />
      <span class="ml-[20px]">{{ description }}</span>
    </div>
    <span
      v-if="props.passed === false"
      class="text-k-blue cursor-pointer hover:text-k-blue-hover"
      @click="showResolveIssuesModal = true"
    >
      {{ $t('codeChecker.resolveIssue') }}
    </span>

    <NeoModal
      append-to-body
      :value="showResolveIssuesModal"
      @close="showResolveIssuesModal = false"
    >
      <NeoModalHead
        :title="$t('codeChecker.resolveIssue')"
        @close="showResolveIssuesModal = false"
      />
      <div class="max-w-[380px] px-6 pt-4 pb-5">
        <p class="text-base font-bold mb-4">
          {{ description }}
        </p>
        <slot name="modalContent" />
      </div>
    </NeoModal>
  </div>
</template>

<script lang="ts" setup>
import { NeoModal, NeoModalHead } from '@kodadot1/brick'
import type { Passed } from './types'

const props = defineProps<{
  passed: Passed
  description: string
  optional?: boolean
}>()

const showResolveIssuesModal = ref(false)

const icon = computed(() => {
  if (props.passed === 'loading') {
    return {
      name: 'i-mdi:loading',
      class: 'text-k-grey animate-spin',
    }
  }
  if (props.passed === 'unknown' || (props.optional && !props.passed)) {
    return {
      name: 'i-mdi:help',
      class: 'text-k-grey',
    }
  }

  return {
    name: props.passed ? 'i-mdi:check' : 'i-mdi:close',
    class: props.passed ? 'text-k-green' : 'text-k-red',
  }
})
</script>
