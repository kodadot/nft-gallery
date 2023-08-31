import { LEWD } from './constatnts'
import { Attribute } from './types'

export function isLewdAttribute(attribute: Attribute | string): boolean {
  const trait = typeof attribute === 'string' ? attribute : attribute.trait
  return trait.toUpperCase() === LEWD
}
