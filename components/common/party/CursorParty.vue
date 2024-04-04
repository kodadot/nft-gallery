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
import { DropEventMintingSession, UserDetails } from '@/composables/party/types'
import isEqual from 'lodash/isEqual'
import Cursor from './Cusor.vue'

export type CursorLabel =
  | {
      loading?: boolean
      label?: string
      mintingSession?: DropEventMintingSession
    }
  | undefined

export type CursorDetails = {
  label: CursorLabel
  ghost?: boolean
  color: () => string
}

const colors = [
  'text-red-500',
  'text-orange-500',
  'text-amber-500',
  'text-yellow-500',
  'text-lime-500',
  'text-green-500',
  'text-emerald-500',
  'text-teal-500',
  'text-cyan-500',
  'text-sky-500',
  'text-blue-500',
  'text-indigo-500',
  'text-violet-500',
  'text-purple-500',
  'text-fuchsia-500',
  'text-pink-500',
  'text-rose-500',
  'text-stone-500',
  'text-neutral-500',
  'text-zinc-500',
  'text-gray-500',
  'text-slate-500',
]

const props = defineProps<{
  connections: UserDetails[]
  ghostOnElements?: string[]
  labelFormatter: (connection: UserDetails) => CursorLabel
}>()

const cursorConnections = ref(new Map<string, CursorDetails>())

const availableColors = ref([...colors])

const getRandomColor = () => {
  let newColors = [...availableColors.value]
  if (!newColors.length) {
    newColors = [...colors]
  }
  const randomIndex = Math.floor(Math.random() * newColors.length)
  const randomColor = newColors[randomIndex]
  newColors.splice(randomIndex, 1)
  availableColors.value = newColors
  return randomColor
}

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
          label: props.labelFormatter(connection),
          color: getRandomColor,
        })
      }
    })

    checkGhostCursors()
  },
  { immediate: true, deep: true },
)
</script>
