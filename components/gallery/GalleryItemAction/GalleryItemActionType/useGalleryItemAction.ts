import { createInteraction } from '@kodadot1/minimark'
import { Interaction } from '@kodadot1/minimark'
import { checkAddress, isAddress } from '@polkadot/util-crypto'

import { dangerMessage, infoMessage } from '@/utils/notification'
import { bsxParamResolver, getApiCall } from '@/utils/gallery/abstractCalls'
import { tokenIdToRoute } from '@/components/unique/utils'
import { ss58Of } from '@/utils/config/chain.config'
import correctFormat from '@/utils/ss58Format'

type ActionList = {
  interaction: Interaction.LIST
  urlPrefix: string
  price: string
  nftId: string
  successMessage?: string
  errorMessage?: string
}

type ActionSend = {
  interaction: Interaction.SEND
  urlPrefix: string
  tokenId: string
  address: string
  nftId: string
  successMessage?: string
  errorMessage?: string
}

type Actions = ActionList | ActionSend

function checkBeforeList(item: ActionList) {
  const meta = item.price

  if (!meta) {
    dangerMessage('Price is not valid')
    return false
  }

  return true
}

function constructTransactionList(item: ActionList, api, executeTransaction) {
  const meta = item.price
  checkBeforeList(item)

  if (item.urlPrefix === 'rmrk') {
    executeTransaction({
      cb: api.tx.system.remark,
      arg: [createInteraction(Interaction.LIST, '1.0.0', item.nftId, meta)],
      successMessage: item.successMessage,
      errorMessage: item.errorMessage,
    })
  }

  if (item.urlPrefix === 'snek' || item.urlPrefix === 'bsx') {
    executeTransaction({
      cb: getApiCall(api, item.urlPrefix, Interaction.LIST),
      arg: bsxParamResolver(item.nftId, Interaction.LIST, meta),
      successMessage: item.successMessage,
      errorMessage: item.errorMessage,
    })
  }
}

function checkBeforeSend(item: ActionSend) {
  const [, err] = checkAddress(
    item.address,
    correctFormat(ss58Of(item.urlPrefix))
  )

  if (!isAddress(item.address)) {
    dangerMessage('Invalid address')
    return
  }

  if (err) {
    dangerMessage(err)
    return
  }
}

function constructTransactionSend(item: ActionSend, api, executeTransaction) {
  const { id, item: token } = tokenIdToRoute(item.tokenId)
  checkBeforeSend(item)

  if (item.urlPrefix === 'rmrk') {
    executeTransaction({
      cb: api.tx.system.remark,
      arg: [
        createInteraction(Interaction.SEND, '1.0.0', item.nftId, item.address),
      ],
      successMessage: item.successMessage,
      errorMessage: item.errorMessage,
    })
  }

  if (item.urlPrefix === 'snek' || item.urlPrefix === 'bsx') {
    executeTransaction({
      cb: api.tx.utility.batchAll,
      arg: [
        [
          api.tx.marketplace.setPrice(id, token, 0),
          api.tx.nft.transfer(id, token, item.address),
        ],
      ],
      successMessage: item.successMessage,
      errorMessage: item.errorMessage,
    })
  }
}

const useExecuteTransaction = () => {
  const { accountId } = useAuth()
  const { howAboutToExecute, isLoading, status, initTransactionLoader } =
    useMetaTransaction()

  const executeTransaction = ({ cb, arg, successMessage, errorMessage }) => {
    initTransactionLoader()
    howAboutToExecute(
      accountId.value,
      cb,
      arg,
      () => infoMessage(successMessage || 'Success!'),
      () => dangerMessage(errorMessage || 'Failed!')
    )
  }

  return {
    isLoading,
    status,
    executeTransaction,
  }
}

export const useGalleryItemAction = () => {
  const { apiInstance } = useApi()
  const { isLoading, status, executeTransaction } = useExecuteTransaction()

  const transaction = async (item: Actions) => {
    const api = await apiInstance.value

    if (item.interaction === Interaction.LIST) {
      constructTransactionList(item, api, executeTransaction)
    }

    if (item.interaction === Interaction.SEND) {
      constructTransactionSend(item, api, executeTransaction)
    }
  }

  return {
    isLoading,
    status,
    transaction,
  }
}
