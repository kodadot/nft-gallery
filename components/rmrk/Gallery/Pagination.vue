<template>
  <div v-if="total > perPage" class="self-end flex justify-end">
    <NeoPagination
      v-model:current="current"
      :total="total"
      :range-before="rangeBefore"
      :range-after="rangeAfter"
      :simple="simple"
      :per-page="perPage"
      tag="a"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"
      @change="onPageChange" />
    <NeoTooltip :label="$t('tooltip.random') + ' (g+r)'" position="left">
      <NeoButton
        v-if="hasMagicBtn"
        class="ml-2 no-shadow"
        :title="$t('tooltip.random')"
        icon-left="dice"
        @click="goToRandomPage">
      </NeoButton>
    </NeoTooltip>
  </div>
</template>

<script setup lang="ts">
import { getRandomIntInRange } from '../utils'
import { NeoButton, NeoPagination, NeoTooltip } from '@kodadot1/brick'

const props = withDefaults(
  defineProps<{
    value: number
    total: number
    perPage?: number
    simple?: boolean
    replace: boolean
    preserveScroll?: boolean
    rangeBefore?: number
    rangeAfter?: number
    hasMagicBtn?: boolean
    enableListenKeyboardEvent?: boolean
  }>(),
  {
    perPage: 20,
    hasMagicBtn: false,
    simple: false,
    rangeBefore: 3,
    rangeAfter: 3,
  },
)
const emit = defineEmits(['input'])

const current = computed({
  get: () => props.value,
  set: (value: number) => {
    emit('input', value)
    replaceUrl(String(value))
  },
})

const scrollTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

const onPageChange = () => {
  if (!props.preserveScroll) {
    scrollTop()
  }
}

const goToRandomPage = () => {
  onPageChange()
  const pageSize = Math.ceil(props.total / props.perPage)
  let randomNumber = getRandomIntInRange(1, pageSize)
  current.value = randomNumber
}

const replaceUrl = (value: string, key = 'page') => {
  const { $consola } = useNuxtApp()
  const route = useRoute()
  const router = useRouter()
  if (route.query[key] !== value) {
    router
      .replace({
        path: String(route.path),
        query: { ...route.query, [key]: value },
      })
      .catch($consola.warn /*Navigation Duplicate err fix later */)
  }
}
</script>
