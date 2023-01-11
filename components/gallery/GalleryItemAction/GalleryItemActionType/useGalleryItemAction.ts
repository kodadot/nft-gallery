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

const defaultValue = {
  cb: undefined,
  arg: undefined,
}

function constructTransactionList(urlPrefix, api, item: ActionList) {
  const meta = item.price

  if (!meta) {
    dangerMessage('Price is not valid')
    return defaultValue
  }

  if (urlPrefix === 'rmrk') {
    return {
      cb: api.tx.system.remark,
      arg: [createInteraction(Interaction.LIST, '1.0.0', item.nftId, meta)],
    }
  }

  if (urlPrefix === 'snek' || urlPrefix === 'bsx') {
    return {
      cb: getApiCall(api, urlPrefix, Interaction.LIST),
      arg: bsxParamResolver(item.nftId, Interaction.LIST, meta),
    }
  }

  dangerMessage('Unknown prefix')

  return defaultValue
}

function constructTransactionSend(urlPrefix, api, item: ActionSend) {
  const { id, item: token } = tokenIdToRoute(item.tokenId)
  const [, err] = checkAddress(
    item.address,
    correctFormat(ss58Of(urlPrefix.value))
  )

  if (!isAddress(item.address)) {
    dangerMessage('Invalid address')
    return defaultValue
  }

  if (err) {
    dangerMessage(err)
    return defaultValue
  }

  if (urlPrefix === 'rmrk') {
    return {
      cb: api.tx.system.remark,
      arg: [
        createInteraction(Interaction.SEND, '1.0.0', item.nftId, item.address),
      ],
    }
  }

  if (urlPrefix === 'snek' || urlPrefix === 'bsx') {
    return {
      cb: api.tx.utility.batchAll,
      arg: [
        [
          api.tx.marketplace.setPrice(id, token, 0),
          api.tx.nft.transfer(id, token, item.address),
        ],
      ],
    }
  }

  return defaultValue
}

export const useGalleryItemAction = () => {
  const cb = ref()
  const arg = ref()

  const { urlPrefix } = usePrefix()
  const { apiInstance } = useApi()
  const { accountId } = useAuth()
  const { howAboutToExecute, isLoading, status, initTransactionLoader } =
    useMetaTransaction()

  const executeTransaction = ({
    successMessage = 'Success!',
    errorMessage = 'Failed!',
  }) => {
    initTransactionLoader()
    howAboutToExecute(
      accountId.value,
      cb.value,
      arg.value,
      () => {
        infoMessage(successMessage)
      },
      () => {
        dangerMessage(errorMessage)
      }
    )
  }

  const transaction = async (item: Actions) => {
    const api = await apiInstance.value

    if (item.interaction === Interaction.LIST) {
      const { cb: newCb, arg: newArg } = constructTransactionList(
        urlPrefix.value,
        api,
        item
      )

      cb.value = newCb
      arg.value = newArg
    }

    if (item.interaction === Interaction.SEND) {
      const { cb: newCb, arg: newArg } = constructTransactionSend(
        urlPrefix.value,
        api,
        item
      )

      cb.value = newCb
      arg.value = newArg
    }

    executeTransaction({
      successMessage: item.successMessage,
      errorMessage: item.errorMessage,
    })
  }

  return {
    isLoading,
    status,
    transaction,
  }
}
