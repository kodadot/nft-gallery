import { availablePrefixWithIcon } from '@/utils/chain'
import type { Prefix } from '@kodadot1/static'

const source = availablePrefixWithIcon().filter(
  (item) => item.value === 'ksm' || item.value === 'rmrk',
)
const destination = availablePrefixWithIcon().filter(
  (item) => item.value === 'ahp' || item.value === 'ahk',
)

// set shared state here
const useSourceSelected = () =>
  useState('sourceSelected', () =>
    availablePrefixWithIcon().find((item) => item.value === 'ksm'),
  )
const useDestinationSelected = () =>
  useState('destinationSelected', () =>
    availablePrefixWithIcon().find((item) => item.value === 'ahp'),
  )

// default composables
export default function useMigrate() {
  const sourceSelected = useSourceSelected()
  const destinationSelected = useDestinationSelected()
  const { urlPrefix, setUrlPrefix } = usePrefix()

  watchEffect(() => {
    const chain = sourceSelected.value?.value

    if (chain !== urlPrefix.value) {
      console.log(chain, urlPrefix.value)
      setUrlPrefix(chain as Prefix)
    }

    if (chain === 'ahk') {
      destinationSelected.value = destination.find(
        (item) => item.value === 'ahp',
      )
    }

    if (chain === 'ahp') {
      destinationSelected.value = destination.find(
        (item) => item.value === 'ahk',
      )
    }
  })

  return {
    source,
    sourceSelected,
    destination,
    destinationSelected,
  }
}
