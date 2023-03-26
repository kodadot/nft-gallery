import { readParam } from '@/components/shared/filters/filterUtils'

export const isAnyActivityFilterActive = (): boolean => {
  const query = useRoute().query

  return (
    readParam(query?.sale) ||
    readParam(query?.listing) ||
    readParam(query?.mint) ||
    readParam(query?.transfer) ||
    readParam(query?.offer)
  )
}
