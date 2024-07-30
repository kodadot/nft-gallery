<template>
  <div
    v-if="prefix"
    class="flex items-center rounded-full bg-neutral-3 dark:bg-neutral-11 px-[6px] py-[3px] h-[22px] gap-[0.375rem]"
  >
    <img
      v-if="dropIcon"
      :src="dropIcon"
      class="w-[12.5px] aspect-square flex-shrink-0"
      alt="chain icon"
    >
    <span class="text-sm uppercase">{{
      UserFriendlyPrefixNameMap[prefix] ?? prefix
    }}</span>
  </div>
</template>

<script lang="ts" setup>
import type { Prefix } from '@kodadot1/static'

const UserFriendlyPrefixNameMap: Partial<Record<Prefix, string>> = {
  ahp: 'dot',
  base: 'base',
  ahk: 'ahk',
}

const props = defineProps<{
  prefix: Prefix | null
}>()

const { getChainIcon } = useIcon()

const dropIcon = computed(() => getChainIcon(props.prefix))
</script>
