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
  price: string
  nftId: string
  successMessage?: string
  errorMessage?: string
}

type ActionSend = {
  interaction: Interaction.SEND
  tokenId: string
  address: string
  nftId: string
  successMessage?: string
  errorMessage?: string
}

type Actions = ActionList | ActionSend

function constructTransactionList(
  urlPrefix,
  api,
  item: ActionList,
  executeTransaction
) {
  const meta = item.price

  if (!meta) {
    return dangerMessage('Price is not valid')
  }

  if (urlPrefix === 'rmrk') {
    return executeTransaction({
      cb: api.tx.system.remark,
      arg: [createInteraction(Interaction.LIST, '1.0.0', item.nftId, meta)],
    })
  }

  if (urlPrefix === 'snek' || urlPrefix === 'bsx') {
    return executeTransaction({
      cb: getApiCall(api, urlPrefix, Interaction.LIST),
      arg: bsxParamResolver(item.nftId, Interaction.LIST, meta),
    })
  }

  return dangerMessage('Unknown prefix')
}

function constructTransactionSend(
  urlPrefix,
  api,
  item: ActionSend,
  executeTransaction
) {
  const { id, item: token } = tokenIdToRoute(item.tokenId)
  const [, err] = checkAddress(
    item.address,
    correctFormat(ss58Of(urlPrefix.value))
  )

  if (!isAddress(item.address)) {
    return dangerMessage('Invalid address')
  }

  if (err) {
    return dangerMessage(err)
  }

  if (urlPrefix === 'rmrk') {
    return executeTransaction({
      cb: api.tx.system.remark,
      arg: [
        createInteraction(Interaction.SEND, '1.0.0', item.nftId, item.address),
      ],
    })
  }

  if (urlPrefix === 'snek' || urlPrefix === 'bsx') {
    return executeTransaction({
      cb: api.tx.utility.batchAll,
      arg: [
        [
          api.tx.marketplace.setPrice(id, token, 0),
          api.tx.nft.transfer(id, token, item.address),
        ],
      ],
    })
  }
}

const useExecuteTransaction = () => {
  const { accountId } = useAuth()
  const { howAboutToExecute, isLoading, status, initTransactionLoader } =
    useMetaTransaction()

  const executeTransaction = ({
    cb,
    arg,
    successMessage = 'Success!',
    errorMessage = 'Failed!',
  }) => {
    initTransactionLoader()
    howAboutToExecute(
      accountId.value,
      cb,
      arg,
      () => {
        infoMessage(successMessage)
      },
      () => {
        dangerMessage(errorMessage)
      }
    )
  }

  return {
    isLoading,
    status,
    executeTransaction,
  }
}

export const useGalleryItemAction = () => {
  const { urlPrefix } = usePrefix()
  const { apiInstance } = useApi()
  const { isLoading, status, executeTransaction } = useExecuteTransaction()

  const transaction = async (item: Actions) => {
    const api = await apiInstance.value

    if (item.interaction === Interaction.LIST) {
      constructTransactionList(urlPrefix.value, api, item, executeTransaction)
    }

    if (item.interaction === Interaction.SEND) {
      constructTransactionSend(urlPrefix.value, api, item, executeTransaction)
    }
  }

  return {
    isLoading,
    status,
    transaction,
  }
}
