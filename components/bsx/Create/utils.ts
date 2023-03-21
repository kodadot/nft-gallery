import { useFiatStore } from '@/stores/fiat'
import { getAssetIdByAccount } from '@/utils/api/bsx/query'

export type Token = 'BSX' | 'KSM'

export const ksmToBsx = (value: number): number => {
  const fiatStore = useFiatStore()
  const KSMToUsd = fiatStore.getCurrentKSMValue
  const BSXToUsd = fiatStore.getCurrentBSXValue
  return value * (Number(KSMToUsd) / Number(BSXToUsd))
}

export const getBalance = (token?: Token): number => {
  const { balance } = useAuth()
  const { $store } = useNuxtApp()
  const { tokenId } = usePrefix()

  if (token === 'KSM') {
    return $store.getters.getTokenBalanceOf(tokenId.value)
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
  const bsxTokenId = '0'
  try {
    const api = await apiInstance.value

    //this function returns
    // '0' if paying in bsx (on Basilisk and Snek)
    // '1' if paying in ksm (on basilisk)
    // '5' if paying in ksm (on Snek)
    const tokenId = await getAssetIdByAccount(api, accountId.value)

    return tokenId === bsxTokenId ? 'BSX' : 'KSM'
  } catch (e) {
    $consola.log(e)
  }

  return 'BSX'
}
