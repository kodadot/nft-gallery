import {
  type DropPhaseConfig,
  PhaseType,
} from '@/components/collection/drop/types'
import { MintPhase } from '@/components/collection/drop/types'

type DropPhaseParams = {
  phases: DropPhaseConfig[] | PhaseType
  maxCount: Ref<number>
  mintedCount: Ref<number>
}

export default ({ phases, maxCount, mintedCount }: DropPhaseParams) => {
  const { $i18n } = useNuxtApp()

  const x: DropPhaseConfig[] = Array.isArray(phases)
    ? phases
    : [{ type: phases, amount: maxCount.value }]

  const mintPhases = computed(() =>
    x.map((phase, index) => {
      const name = phase.name ? $i18n.t(phase.name) : undefined

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
