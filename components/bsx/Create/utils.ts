import { useFiatStore } from '@/stores/fiat'
import { getAssetIdByAccount } from '@/utils/api/bsx/query'

export type Token = 'BSX' | 'KSM'

const tokenToTokenId: { [K in Token]: string } = {
  BSX: '0',
  KSM: '1',
}

export const ksmToBsx = (KsmValue: number): number => {
  const fiatStore = useFiatStore()
  const KSMToUsd = fiatStore.getCurrentKSMValue
  const BSXToUsd = fiatStore.getCurrentBSXValue
  return KsmValue * (Number(KSMToUsd) / Number(BSXToUsd))
}

export const getBalance = (token?: Token): number => {
  const { balance } = useAuth()
  const { $store } = useNuxtApp()

  if (token === 'KSM') {
    return $store.getters.getTokenBalanceOf(tokenToTokenId['KSM'])
  }
  return balance.value
}

export const getDeposit = (token: Token, depositInKSM: number): number => {
  return token === 'KSM' ? depositInKSM : ksmToBsx(depositInKSM)
}

export const getFeesToken = async (): Promise<Token> => {
  const { apiInstance } = useApi()
  const { accountId } = useAuth()
  const { $consola } = useNuxtApp()
  try {
    const api = await apiInstance.value
    const tokenId = await getAssetIdByAccount(api, accountId.value)
    return tokenId === tokenToTokenId['BSX'] ? 'BSX' : 'KSM'
  } catch (e) {
    $consola.log(e)
  }

  return 'BSX'
}
