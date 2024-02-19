<template>
  <div>
    <div
      v-for="connection in connections"
      :key="connection.id"
      class="absolute z-[998] pointer-events-none transition-all"
      :class="[{ 'opacity-20': cursorConnections.get(connection.id)?.ghost }]"
      :style="{
        top: `${connection.cursor?.y}px`,
        left: `${connection.cursor?.x}px`,
      }">
      <NeoIcon
        :id="`cursor-${connection.id}`"
        icon="arrow-pointer"
        pack="fas"
        :class="cursorConnections.get(connection.id)?.color" />

      <div
        v-if="getLabel(connection).label"
        class="px-[0.2rem] py-[0.1rem] ml-2 text-xs bg-neutral-3 dark:bg-neutral-11 rounded-full w-fit flex gap-1">
        <span>{{ getLabel(connection).label }}</span>
        <NeoIcon
          v-if="getLabel(connection).loading"
          icon="spinner-third"
          spin />
      </div>
      <div v-else class="ml-2">
        <BaseMediaItem
          class="border border-k-shade w-16 h-16"
          alt="cursor minted nft"
          :src="sanitizeIpfsUrl(getLabel(connection).image)"
          :animation-src="sanitizeIpfsUrl(getLabel(connection).image)"
          preview
          is-detail />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'
import { UserDetails } from '@/composables/party/types'
import isEqual from 'lodash/isEqual'

export type CursorLabel = { loading?: boolean; label?: string; image?: string }

const colors = [
  'text-k-pink',
  'text-k-blue',
  'text-k-orange',
  'text-k-aqua-blue',
  'text-k-red',
  'text-k-green',
]

const props = defineProps<{
  connections: UserDetails[]
  ghostOnElements?: string[]
  labelFormatter: (connection: UserDetails) => CursorLabel
}>()

const cursorConnections = ref(
  new Map<
    string,
    {
      color: string
      label: CursorLabel
      ghost?: boolean
    }
  >(),
)

const getLabel = (connection: UserDetails) =>
  cursorConnections.value.get(connection.id)?.label as CursorLabel

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)]

const areRectanglesIntersecting = (rect1: DOMRect, rect2: DOMRect) => {
  return !(
    rect2.left > rect1.right ||
    rect2.right < rect1.left ||
    rect2.top > rect1.bottom ||
    rect2.bottom < rect1.top
  )
}

const checkGhostCursors = () => {
  props.connections.forEach((connection) => {
    props.ghostOnElements?.forEach((selector) => {
      const elements = document.querySelectorAll(
        `[data-partykit="${selector}"]`,
      )
      let ghost = false

      elements.forEach((element) => {
        if (ghost) {
          return
        }

        const cursor = document.getElementById(`cursor-${connection.id}`)
        if (!element || !cursor) {
          return
        }

        ghost = areRectanglesIntersecting(
          cursor.getBoundingClientRect(),
          element.getBoundingClientRect(),
        )
      })

      cursorConnections.value.set(connection.id, {
        ...(cursorConnections.value.get(connection.id) as any),
        ghost: ghost,
      })
    })
  })
}

watch(
  () => props.connections,
  (connections, prevConnections) => {
    checkGhostCursors()

    connections.forEach((connection) => {
      const isNew = !cursorConnections.value.has(connection.id)
      const prevConnection = prevConnections?.find(
        (prevConnection) => connection.id === prevConnection.id,
      )

      const newSpent = prevConnection?.spent !== connection.spent
      const updateLabel =
        !isEqual(prevConnection?.lastEvent, connection.lastEvent) ||
        (prevConnection?.lastEvent &&
          Date.now() - prevConnection.lastEvent.timestamp > 1000)

      if (isNew || newSpent || updateLabel) {
        const cursorConnection = cursorConnections.value.get(connection.id)
        cursorConnections.value.set(connection.id, {
          ghost: Boolean(cursorConnection?.ghost),
          color: cursorConnection?.color || getRandomColor(),
          label: props.labelFormatter(connection),
        })
      }
    })
  },
  { immediate: true, deep: true },
)
</script>
