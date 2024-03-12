type Cursor = {
  x: number
  y: number
  type?: 'touch' | 'mouse'
  lastUpdate?: number
}

export enum DropEventType {
  DROP_GENERATING = 'drop_generating',
  DROP_MINTING = 'drop_minting',
  DROP_MINTED = 'drop_minted',
}

export type DropEvent = {
  id: string
  type: DropEventType
  image?: string
  timestamp: number
  completed?: boolean
}

export type UserDetails = {
  id: string
  spent?: number
  lastEvent?: DropEvent
  cursor?: Cursor
}

export type MaybeUserDetails = UserDetails | null

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
  connections: Record<string, MaybeUserDetails>
}
