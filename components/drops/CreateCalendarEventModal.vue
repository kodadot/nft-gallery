<template>
  <NeoModal
    :value="isModalActive"
    :can-cancel="['outside', 'escape']"
    scroll="clip"
    @close="onClose">
    <ModalBody :title="$t('drops.createACalendarEvent')" @close="onClose">
      <p class="capitalize">{{ $t('drops.kodadotWeeklyGenerativeDrop') }}</p>

      <p class="text-k-grey mt-3">{{ $t('drops.everyThursday') }} - 3pm CET</p>

      <div class="flex !mt-6 flex-col gap-6">
        <NeoButton
          v-for="provider in providers"
          :key="provider.id"
          class="w-full"
          size="large"
          no-shadow
          @click="addEvent(provider.id)">
          <div class="flex gap-2 justify-center">
            <NeoIcon :icon="provider.icon" pack="fab" />
            <span>{{ provider.label }}</span>
          </div>
        </NeoButton>
      </div>
    </ModalBody>
  </NeoModal>
</template>
<script setup lang="ts">
import { NeoButton, NeoIcon, NeoModal } from '@kodadot1/brick'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import { addHours, format } from 'date-fns'

type CalendarProvider = 'google'

const props = defineProps<{
  modelValue: boolean
}>()

const isModalActive = useVModel(props, 'modelValue')

const providers: { id: CalendarProvider; label: string; icon: string }[] = [
  {
    id: 'google',
    label: 'Google Calendar',
    icon: 'google',
  },
]

const eventDetails = {
  name: 'Kodadot Generative Drop',
  url: 'https://kodadot.xyz/drops',
  hoursDuration: 3,
}

const getNextDropDate = (): Date => {
  const currentDate = new Date()
  const daysUntilThursday = (11 - currentDate.getDay()) % 7
  const millisecondsUntilThursday = daysUntilThursday * 24 * 60 * 60 * 1000
  currentDate.setUTCHours(14, 0, 0, 0) // Set time to 3 PM CET
  const dropDate = new Date(currentDate.getTime() + millisecondsUntilThursday)
  dropDate.setHours(currentDate.getHours())
  return dropDate
}

const getRfc5545FormatDate = (date: Date) =>
  `${format(date, "yyyyMMdd'T'HH")}0000`

const addGoogleEvent = () => {
  const dropDate = getNextDropDate()

  const queryParams = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventDetails.name,
    dates: `${getRfc5545FormatDate(dropDate)}/${getRfc5545FormatDate(addHours(dropDate, eventDetails.hoursDuration))}`,
    location: eventDetails.url,
    recur: 'RRULE:FREQ=WEEKLY;BYDAY=TH',
  })

  const calendarURL = new URL('https://www.google.com/calendar/event')
  calendarURL.search = queryParams.toString()

  window.open(calendarURL.toString(), '_blank')
}

const addEvent = (provider: CalendarProvider) => {
  switch (provider) {
    case 'google':
      return addGoogleEvent()
  }
}

const onClose = () => {
  isModalActive.value = false
}
</script>
