<template>
  <div>
    <h2 class="text-3xl font-semibold mb-7">
      {{ $t('drops.dropCalendar') }}
    </h2>

    <div class="flex flex-col gap-14">
      <div v-for="(grouppedDrop, label) in grouppedDropCalendars" :key="label">
        <div class="mb-6 flex items-center">
          <NeoButton variant="secondary-rounded" no-shadow>{{
            label
          }}</NeoButton>
          <hr class="w-full" />
        </div>

        <DropsGrid
          :drops="grouppedDrop"
          :loaded="!pending"
          :default-skeleton-count="defaultSkeletonCount"
          skeleton-key="current-drops-skeleton">
          <template #card="{ item }: { item: DropCalendar }">
            <DropsBasicDropCard
              :name="item.name"
              :price="item.price"
              :image="sanitizeIpfsUrl(item.items[0]?.image)"
              :drop-start-time="
                item.date ? fromatCETDate(item.date, item.time) : null
              "
              :drop-status="DropStatus.SCHEDULED"
              :show-time-tag="item.date !== null"
              :time-tag-with-time="Boolean(item.time)"
              @click="() => handleClick(item)">
              <template v-if="item.price === null" #price>
                <span class="text-k-grey">{{ $t('helper.priceNotSet') }}</span>
              </template>
            </DropsBasicDropCard>
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
import { addMonths, format } from 'date-fns'
import DropPreviewModal from './DropPreviewModal.vue'
import { DropCalendar, getDropCalendar } from '@/services/fxart'
import groupBy from 'lodash/groupBy'
import { fromatCETDate } from '@/components/drops/utils'

defineProps<{
  defaultSkeletonCount: number
}>()

const { data, pending } = useAsyncData<DropCalendar[]>(() => getDropCalendar())

const previewDropCalendar = ref<DropCalendar>()

const scheduledDropCalendars = computed(() =>
  data.value?.filter((item) => item.date),
)

const unscheduledDropCalendars = computed(() =>
  data.value?.filter((item) => !item.date),
)

const oldestDate = computed(() =>
  Math.min.apply(
    null,
    scheduledDropCalendars.value?.map((x) => new Date(x.date)),
  ),
)

const grouppedDropCalendars = computed(() => {
  const groupped = groupBy(scheduledDropCalendars.value, (x) =>
    formatDate(x.date!),
  )

  if (unscheduledDropCalendars.value?.length) {
    Object.assign(groupped, {
      [`${format(addMonths(oldestDate.value, 1), 'MMMM')} +`]:
        unscheduledDropCalendars.value,
    })
  }

  return groupped
})

const formatDate = (date: string) => format(new Date(date), 'dd. MMMM')

const handleClick = (dropCalendar: DropCalendar) => {
  previewDropCalendar.value = dropCalendar
}
</script>
