import { endOfHour } from 'date-fns'

const now = new Date()
export const countDownTime = endOfHour(now).getTime()

export const slidesCountOnTimeCountdown = 10
export const collectionId = '6'

export const DISPLAY_SLIDE_IMAGE_COUNT = 4
