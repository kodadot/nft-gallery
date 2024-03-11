<template>
  <div class="flex justify-between">
    <div>
      <NeoIcon
        :icon="icon.name"
        :class="['text-lg', icon.class]"
        :spin="icon.spin" />
      <span class="ml-[20px]">{{ description }}</span>
    </div>
    <span
      v-if="props.passed === false"
      class="text-k-blue cursor-pointer hover:text-k-blue-hover"
      @click="showResolveIssuesModal = true">
      {{ $t('codeChecker.resolveIssue') }}
    </span>

    <NeoModal
      append-to-body
      :value="showResolveIssuesModal"
      @close="showResolveIssuesModal = false">
      <NeoModalHead
        :title="$t('codeChecker.resolveIssue')"
        @close="showResolveIssuesModal = false" />
      <div class="max-w-[380px] px-6 pt-4 pb-5">
        <p class="text-base font-bold mb-4">{{ description }}</p>
        <slot name="modalContent"></slot>
      </div>
    </NeoModal>
  </div>
</template>

<script lang="ts" setup>
import { NeoIcon, NeoModal, NeoModalHead } from '@kodadot1/brick'
import { Passed } from './types'

const props = defineProps<{
  passed: Passed
  description: string
}>()

const showResolveIssuesModal = ref(false)

const icon = computed(() => {
  if (props.passed === 'loading') {
    return {
      name: 'spinner-third',
      class: 'text-k-grey',
      spin: true,
    }
  }
  if (props.passed === 'unknown') {
    return {
      name: 'question',
      class: 'text-k-grey',
    }
  }

  return {
    name: props.passed ? 'check' : 'xmark',
    class: props.passed ? 'text-k-green' : 'text-k-red',
  }
})
</script>
