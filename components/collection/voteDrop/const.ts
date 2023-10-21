import { endOfWeek } from 'date-fns'

const now = new Date()
export const countDownTime = endOfWeek(now).getTime()

export const VOTE_DROP_DESCRIPTION =
  'Waifu is happy you voted AYE on a very important proposal to improve Polkadot Ecosystem. As a token of appreciation, you can add her to your collection.'
