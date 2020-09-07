import Connector from '@vue-polkadot/vue-api'
import { BTreeMap } from '@polkadot/types'
import AccountId from '@polkadot/types/generic/AccountId'
import { RewardPoint } from '@polkadot/types/interfaces'

export const getEraPoints = async (): Promise<Record<string, string>> => {
  const { api } = Connector.getInstance()
  const response = await api.derive.staking?.currentPoints()

  if (!response.individual) {
    return {}
  }

  return mapEraPoint(response.individual)
}

export const mapEraPoint = (eraPoints: BTreeMap<AccountId, RewardPoint>): Record<string, string> => {
  let result: Record<string, string> = {};

  eraPoints.forEach((value, key) => {
    result[key.toString()] = value.toString()
  })

  return result;
}
