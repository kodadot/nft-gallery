import { endOfWeek } from 'date-fns'

const now = new Date()
export const countDownTime = endOfWeek(now).getTime()

export const STMN_COLLECTION_ID = '6'
export const STT_COLLECTION_ID = 'u-8'
export const pricePerMint = '9000000000' // '100000000'
export const displayPricePerMint = 1e10
export const STMN_DROP_CAMPAIGN = 'copenhagen'
export const STT_DROP_CAMPAIGN = 'copenhagen2'
export const MINT_ADDRESS = '15CoYMEnJhhWHvdEPXDuTBnZKXwrJzMQdcMwcHGsVx5kXYvW'
