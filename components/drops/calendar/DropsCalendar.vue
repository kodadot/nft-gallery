<template>
  <div>
    <h2 class="text-3xl font-semibold mb-7">
      {{ $t('drops.dropCalendar') }}
    </h2>

    <div class="flex flex-col gap-14">
      <div v-for="(grouppedDrop, date) in grouppedDrops" :key="date">
        <div class="mb-6 flex items-center">
          <NeoButton variant="secondary-rounded" no-shadow>{{
            formatDate(date as string)
          }}</NeoButton>
          <hr class="w-full" />
        </div>

        <DropsGrid
          :drops="grouppedDrop"
          :loaded="!pending"
          :default-skeleton-count="defaultSkeletonCount"
          skeleton-key="current-drops-skeleton">
          <template #card="{ item }">
            <DropsBasicDropCard
              :name="item.name"
              :image="sanitizeIpfsUrl(item.image)"
              :drop-start-time="new Date(item.date)"
              :drop-status="DropStatus.SCHEDULED"
              show-time-tag
              @click="() => handleClick(item)" />
          </template>
        </DropsGrid>
      </div>
    </div>

    <DropPreviewModal
      :drop-calendar="previewDropCalendar"
      @close="previewDropCalendar = undefined" />
  </div>
</template>
<script lang="ts" setup>
import { DropStatus } from '@/components/drops/useDrops'
import { NeoButton } from '@kodadot1/brick'
import { format } from 'date-fns'
import groupBy from 'lodash/groupBy'
import DropPreviewModal from './DropPreviewModal.vue'
import { DropCalendar, getDropCalendar } from '@/services/fxart'

defineProps<{
  defaultSkeletonCount: number
}>()

const { data, pending } = useAsyncData(() => getDropCalendar())

const previewDropCalendar = ref<DropCalendar>()

const grouppedDrops = computed(() => groupBy(data.value, (i) => i.date))

const formatDate = (date: string) => format(new Date(date), 'dd. MMMM')

const handleClick = (dropCalendar: DropCalendar) => {
  previewDropCalendar.value = dropCalendar
}
</script>
