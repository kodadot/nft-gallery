import { useFiatStore } from '@/stores/fiat'

export type Token = 'BSX' | 'KSM'

export const ksmToBsx = (value: number): number => {
  const fiatStore = useFiatStore()
  const KSMToUsd = fiatStore.getCurrentKSMValue
  const BSXToUsd = fiatStore.getCurrentBSXValue
  return value * (Number(KSMToUsd) / Number(BSXToUsd))
}

export const getBalance = (_token?: Token): number => {
  const { balance } = useAuth()

  return Number(balance.value)
}

export const getDeposit = (token: Token, depositInKSM: number): number => {
  return token === 'KSM' ? depositInKSM : ksmToBsx(depositInKSM)
}
