import { endOfHour } from 'date-fns'

const now = new Date()
export const countDownTime = endOfHour(now).getTime()

export const collectionId = '8'

export const enableUnlockableMintPrefix = ['stmn']
