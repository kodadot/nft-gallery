import { endOfHour } from 'date-fns'

const now = new Date()
export const countDownTime = endOfHour(now).getTime()

export const slidesCountOnTimeCountdown = 10

export const DISPLAY_SLIDE_IMAGE_COUNT = 4

export const DOT_EXISTENTIAL_DEPOSIT = 1
export const KSM_EXISTENTIAL_DEPOSIT = 0.000333
