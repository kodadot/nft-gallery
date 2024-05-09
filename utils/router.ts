import type { LocationQueryValue } from 'vue-router'

export const parseQueryParamToArray = (
  value: LocationQueryValue | LocationQueryValue[],
): string[] => (Array.isArray(value) ? (value as string[]) : [value as string])
