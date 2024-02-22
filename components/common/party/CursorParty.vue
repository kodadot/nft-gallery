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

export type CursorLabel =
  | { loading?: boolean; label?: string; image?: string }
  | undefined

export type CursorDetails = {
  color: string
  label: CursorLabel
  ghost?: boolean
}

const colors = [
  'text-red-500 dark:text-red-600',
  'text-orange-500 dark:text-orange-600',
  'text-amber-500 dark:text-amber-600',
  'text-yellow-500 dark:text-yellow-600',
  'text-lime-500 dark:text-lime-600',
  'text-green-500 dark:text-green-600',
  'text-emerald-500 dark:text-emerald-600',
  'text-teal-500 dark:text-teal-600',
  'text-cyan-500 dark:text-cyan-600',
  'text-sky-500 dark:text-sky-600',
  'text-blue-500 dark:text-blue-600',
  'text-indigo-500 dark:text-indigo-600',
  'text-violet-500 dark:text-violet-600',
  'text-purple-500 dark:text-purple-600',
  'text-fuchsia-500 dark:text-fuchsia-600',
  'text-pink-500 dark:text-pink-600',
  'text-rose-500 dark:text-rose-600',
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

    checkGhostCursors()
  },
  { immediate: true, deep: true },
)
</script>
