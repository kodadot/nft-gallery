<template>
  <div>
    <template v-for="connection in connections" :key="connection.id">
      <Cursor
        v-if="cursorConnections.get(connection.id)"
        :connection="connection"
        :cursor-details="
          cursorConnections.get(connection.id) as CursorDetails
        " />
    </template>
  </div>
</template>

<script setup lang="ts">
import { UserDetails } from '@/composables/party/types'
import isEqual from 'lodash/isEqual'
import Cursor from './Cusor.vue'

export type CursorLabel = { loading?: boolean; label?: string; image?: string }

export type CursorDetails = {
  color: string
  label: CursorLabel
  ghost?: boolean
}

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

const cursorConnections = ref(new Map<string, CursorDetails>())

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
