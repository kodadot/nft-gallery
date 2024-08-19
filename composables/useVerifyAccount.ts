import { isEthereumAddress } from '@polkadot/util-crypto'
import { useSignMessage } from '@wagmi/vue'
import { fetchProfileByAddress } from '@/services/profile'

export type SignaturePair = { signature: string, message: string }

const signMessagePolkadot = async (address: string, message: string) => {
  const injector = await getAddress(toDefaultAddress(address))
  const signedMessage = await injector.signer.signRaw({
    address: address,
    data: message,
    type: 'bytes',
  })
  console.log('Signed polkadot message:', { message, address, signedMessage })
  return signedMessage.signature
}

const SIGNATURE_MESSAGE = 'Verify ownership of this account on Koda'

export const generateVersionedSignatureMessage = (version: number) =>
  `${SIGNATURE_MESSAGE} - ${version}`

export default function useVerifyAccount() {
  const walletStore = useWalletStore()
  const { accountId } = useAuth()
  const signedMessage = computed(() => walletStore.getSignedMessage)
  const { signMessageAsync } = useSignMessage()

  const signMessageEthereum = async (address: string, message: string) => {
    const signedMessage = await signMessageAsync({
      account: address as `0x${string}`,
      message: message,
    })

    console.log('Signed evm message:', { message, address, signedMessage })
    return signedMessage
  }

  const getSignedMessage = async (message: string): Promise<string> => {
    if (!accountId.value) {
      throw new Error('Please connect your wallet first')
    }

    const signMessageFn = isEthereumAddress(accountId.value)
      ? signMessageEthereum
      : signMessagePolkadot
    const signature = await signMessageFn(accountId.value, message)

    if (signature) {
      return signature
    }

    throw new Error('You have not completed address verification')
  }

  const getCustomSignaturePair = async (message: string) => {
    const signature = await getSignedMessage(message)
    return {
      signature,
      message,
    }
  }

  const getProfileVersionedSignaturePair = async (address: string) => {
    const profile = await fetchProfileByAddress(address)
    return await getCustomSignaturePair(
      generateVersionedSignatureMessage(
        profile?.version ? profile.version + 1 : 1,
      ),
    )
  }

  const getCommonSignaturePair = async () => {
    if (signedMessage.value) {
      return {
        signature: signedMessage.value,
        message: SIGNATURE_MESSAGE,
      }
    }
    const signature = await getSignedMessage(SIGNATURE_MESSAGE)
    walletStore.setSignedMessage(signature)

    return {
      signature,
      message: SIGNATURE_MESSAGE,
    }
  }

  return {
    getCommonSignaturePair,
    getCustomSignaturePair,
    getProfileVersionedSignaturePair,
  }
}
