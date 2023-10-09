import { endOfWeek } from 'date-fns'

const now = new Date()
export const countDownTime = endOfWeek(now).getTime()

export const displayPricePerMint = 1e10
export const MINT_ADDRESS = '15CoYMEnJhhWHvdEPXDuTBnZKXwrJzMQdcMwcHGsVx5kXYvW'
