<template>
  <div>
    <div
      v-for="connection in connections"
      :key="connection.id"
      class="absolute z-[998] pointer-events-none transition-all"
      :class="[{ 'opacity-20': cursorConnections.get(connection.id)?.ghost }]"
      :style="{
        top: `${connection.y}px`,
        left: `${connection.x}px`,
      }">
      <NeoIcon
        :id="`cursor-${connection.id}`"
        icon="arrow-pointer"
        pack="fas"
        :class="cursorConnections.get(connection.id)?.color" />

      <div
        class="px-[0.2rem] py-[0.1rem] ml-2 text-xs bg-neutral-3 dark:bg-neutral-11 rounded-full w-fit">
        {{ cursorConnections.get(connection.id)?.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'
import { UserDetails } from '@/composables/party/types'

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
  labelFormatter: (connection: UserDetails) => string
}>()

const cursorConnections = ref(
  new Map<
    string,
    {
      color: string
      label: string
      ghost?: boolean
    }
  >(),
)

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
      elements.forEach((element) => {
        const cursor = document.getElementById(`cursor-${connection.id}`)

        if (!element || !cursor) {
          return
        }

        const ghost = areRectanglesIntersecting(
          cursor.getBoundingClientRect(),
          element.getBoundingClientRect(),
        )

        cursorConnections.value.set(connection.id, {
          ...(cursorConnections.value.get(connection.id) as any),
          ghost: ghost,
        })
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
      const newSpent =
        prevConnections &&
        prevConnections.find(
          (prevConnection) => connection.id === prevConnection.id,
        )?.spent !== connection.spent

      if (isNew || newSpent) {
        const color = cursorConnections.value.get(connection.id)?.color
        cursorConnections.value.set(connection.id, {
          color: color || getRandomColor(),
          label: props.labelFormatter(connection),
        })
      }
    })
  },
  { immediate: true, deep: true },
)
</script>
