export type NeoButtonVariant =
  | 'primary'
  | 'secondary'
  | 'primary-rounded'
  | 'secondary-rounded'
  | 'outlined-rounded'
  | 'rounded'
  | 'k-blue'
  | 'k-pink'
  | 'connect'
  | 'connect-dropdown'
  | 'icon'
  | 'disabled-secondary'
  | 'text'
  | 'pill'
  | 'border-icon'

export type NeoMessageVariant =
  | 'warning'
  | 'success'
  | 'danger'
  | 'info'
  | 'neutral'

export type NeoMessageCustomIconVariant = { icon: string; spin: boolean }
export type NeoMessageIconVariant = string | NeoMessageCustomIconVariant
