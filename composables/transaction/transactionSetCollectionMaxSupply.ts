import { ActionSetCollectionMaxSupply, ExecuteTransactionParams } from './types'

export function execSetCollectionMaxSupply(
  params: ActionSetCollectionMaxSupply,
  api,
  executeTransaction: ({
    cb,
    arg,
    successMessage,
    errorMessage,
  }: ExecuteTransactionParams) => void,
) {
  const collectionId = params.collectionId.toString()
  const maxSupply = params.max.toString()

  try {
    // item.urlPrefix === 'ahr'
    if (params.urlPrefix === 'ahk' || params.urlPrefix === 'ahp') {
      executeTransaction({
        cb: api.tx.nfts.setCollectionMaxSupply,
        arg: [collectionId, maxSupply],
      })
    }
  } catch (error) {
    warningMessage(error)
  }
}
