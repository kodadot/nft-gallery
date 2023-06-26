import { endOfWeek } from 'date-fns'

const now = new Date()
export const countDownTime = endOfWeek(now).getTime()

export const collectionId = '6'
export const pricePerMint = '100000000' // '9000000000'
export const DROP_CAMPAIGN = 'corns'
export const MINT_ADDRESS = 'Gn84LKb5HSxc3SACayxCzKQcWESRMcT1VUCqeZURfGj6ASi'
