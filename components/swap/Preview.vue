<template>
  <div class="border bg-background-color shadow-primary pb-6 w-full h-min md:w-[444px] lg:w-[490px] relative">
    <div class="px-6 py-4 flex justify-between border-b items-center">
      <div class="text-base font-bold line-height">
        {{ title }}
      </div>
    </div>

    <div class="p-6 min-h-[50vh] overflow-y-auto">
      YEET
    </div>

    <div class="pb-4 px-6">
      <div class="flex gap-4">
        <NeoButton
          size="large"
          label="Back"
          variant="text"
          no-shadow
          expanded
          @click="router.back()"
        />
        <NeoButton
          size="large"
          label="Next"
          variant="primary"
          no-shadow
          expanded
          @click="emit('next')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'

const emit = defineEmits(['next'])
defineProps<{ title: string }>()

const router = useRouter()
</script>
