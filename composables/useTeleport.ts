import {
    Chain,
  } from '@/utils/teleport'

export default function () {
    const identityStore = useIdentityStore()

    const chainBalances = {
        [Chain.KUSAMA]: () =>
          identityStore.multiBalances.chains.kusama?.ksm?.nativeBalance,
        [Chain.BASILISK]: () =>
          identityStore.multiBalances.chains.basilisk?.ksm?.nativeBalance,
        [Chain.STATEMINE]: () =>
          identityStore.multiBalances.chains.kusamaHub?.ksm?.nativeBalance,
        [Chain.POLKADOT]: () =>
          identityStore.multiBalances.chains.polkadot?.dot?.nativeBalance,
        [Chain.STATEMINT]: () =>
          identityStore.multiBalances.chains.polkadotHub?.dot?.nativeBalance,
      }

      return {
        chainBalances
      }
}