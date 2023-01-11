import { createInteraction } from '@kodadot1/minimark'
import { Interaction } from '@kodadot1/minimark'
import { checkAddress, isAddress } from '@polkadot/util-crypto'

import { dangerMessage, infoMessage } from '@/utils/notification'
import { bsxParamResolver, getApiCall } from '@/utils/gallery/abstractCalls'
import { tokenIdToRoute } from '@/components/unique/utils'
import { ss58Of } from '@/utils/config/chain.config'
import correctFormat from '@/utils/ss58Format'

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

  const transactionList = async ({
    price = '',
    nftId = '',
    successMessage = '',
    errorMessage = '',
  }) => {
    const api = await apiInstance.value
    const meta = price

    if (!meta) {
      dangerMessage('Price is not valid')
      return
    }

    switch (urlPrefix.value) {
      case 'rmrk':
        cb.value = api.tx.system.remark
        arg.value = [createInteraction(Interaction.LIST, '1.0.0', nftId, meta)]
        break

      case 'snek':
      case 'bsx':
        cb.value = getApiCall(api, urlPrefix.value, Interaction.LIST)
        arg.value = bsxParamResolver(nftId, Interaction.LIST, meta)
        break

      default:
        dangerMessage('Unknown prefix')
        break
    }

    executeTransaction({ successMessage, errorMessage })
  }

  const transactionSend = async ({
    urlId = '',
    address = '',
    nftId = '',
    successMessage = '',
    errorMessage = '',
  }) => {
    const api = await apiInstance.value
    const { id, item } = tokenIdToRoute(urlId)
    const [, err] = checkAddress(
      address,
      correctFormat(ss58Of(urlPrefix.value))
    )

    if (!isAddress(address)) {
      dangerMessage('Invalid address')
      return
    }

    if (err) {
      dangerMessage(err)
      return
    }

    switch (urlPrefix.value) {
      case 'rmrk':
        cb.value = api.tx.system.remark
        arg.value = [
          createInteraction(Interaction.SEND, '1.0.0', nftId, address),
        ]
        break

      case 'bsx':
      case 'snek':
        cb.value = api.tx.utility.batchAll
        arg.value = [
          [
            api.tx.marketplace.setPrice(id, item, 0),
            api.tx.nft.transfer(id, item, address),
          ],
        ]
        break

      default:
        dangerMessage('Unknown prefix')
        break
    }

    executeTransaction({ successMessage, errorMessage })
  }

  return {
    isLoading,
    status,
    transactionList,
    transactionSend,
  }
}
