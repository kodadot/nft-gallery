import { type DropPhase } from '@/components/collection/drop/types'
import { MintPhase } from '@/components/collection/drop/types'

type DropPhaseParams = {
  phases: DropPhase[]
  maxCount: Ref<number>
  mintedCount: Ref<number>
}

export default ({ phases, maxCount, mintedCount }: DropPhaseParams) => {
  const { $i18n } = useNuxtApp()

  const mintPhases = computed(() =>
    phases.map((phase, index) => {
      const name =
        index === 0
          ? $i18n.t('mint.unlockable.privateMint')
          : $i18n.t('mint.unlockable.publicMint')

      const phaseMax = phase.amount || maxCount.value
      const phaseMinted = new Array(maxCount.value)
        .fill(true, 0, mintedCount.value)
        .slice(phaseMax * index, phaseMax * (index + 1))
        .filter(Boolean).length

      const phaseMintedOut = phaseMax === phaseMinted
      const active = !phaseMintedOut
      const disabled = !active

      return {
        name: name,
        type: phase.type,
        disabled: disabled,
        mintedOut: phaseMintedOut,
        count: {
          max: phaseMax,
          minted: phaseMinted,
        },
      } as MintPhase
    }),
  )

  return {
    mintPhases,
  }
}
