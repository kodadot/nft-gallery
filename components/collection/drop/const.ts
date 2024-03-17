import { endOfWeek } from 'date-fns'

const now = new Date()
export const countDownTime = endOfWeek(now).getTime()

export const MINT_ADDRESS = '15CoYMEnJhhWHvdEPXDuTBnZKXwrJzMQdcMwcHGsVx5kXYvW'

export const MINTING_SECONDS = 120
