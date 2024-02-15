type Cursor = {
  x: number
  y: number
  cursor?: 'touch' | 'mouse'
  lastUpdate?: number
}

export type UserDetails = {
  id: string
  spent?: number
} & Cursor

export type UpdateMessage = {
  type: 'update'
  details: UserDetails
}

export type RemoveMessage = {
  type: 'remove'
  id: string
}

export type SyncMessage = {
  type: 'sync'
  connections: UserDetails[]
}
