import type { NeoButtonVariant } from '@kodadot1/brick'

export enum ProfileTab {
  OWNED = 'owned',
  CREATED = 'created',
  COLLECTIONS = 'collections',
  ACTIVITY = 'activity',
  OFFERS = 'offers',
  SWAPS = 'swaps',
}

export interface ButtonConfig {
  label: string
  icon?: string
  onClick?: () => void
  classes?: string
  variant?: NeoButtonVariant
  active?: boolean
  disabled?: boolean
}

export type Tab = 'following' | 'followers'
