import { formatDuration, intervalToDuration, intlFormat } from 'date-fns'
import { getDropById } from '@/services/fxart'
import { evmCollection } from '@/utils/onchain/evm'
import { subCollection } from '@/utils/onchain/sub'

export function toDropScheduledDurationString(startTime: Date, short: boolean = false) {
  const duration = intervalToDuration({
    start: startTime,
    end: new Date(),
  })

  const options = {
    format: ['hours', 'minutes'],
  }

  if (short) {
    Object.assign(options, {
      locale: {
        formatDistance: (token: string, count: string) => {
          return {
            xHours: '{{count}}h',
            xMinutes: '{{count}}m',
            xSeconds: '{{count}}s',
          }?.[token]?.replace('{{count}}', count)
        },
      } as Locale,
    })
  }

  return formatDuration(duration, options)
}

export function formatDropStartTime(
  startTime: Date,
  locale: string,
  withTime = false,
) {
  const options = {
    day: '2-digit',
    month: withTime ? '2-digit' : 'long',
    hour12: withTime,
  } as const

  if (withTime) {
    Object.assign(options, {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return intlFormat(startTime, options, { locale })
}

export const formatCETDate = (date: string, time: string): Date =>
  new Date(`${date}T${time}+02:00`)

export const parseCETDate = (datetime: string): Date => {
  const [date, time] = datetime.split(' ')
  return formatCETDate(date, time)
}

export const dateHasTime = (datetime: string): boolean => /:/.test(datetime)

export async function getDropAttributes(alias: string, isEvm: boolean) {
  // get some offchain data
  const campaign = await getDropById(alias)
  const offChainData = {
    id: campaign.id,
    chain: campaign.chain,
    alias: campaign.alias,
    collection: campaign.collection,
    type: campaign.type,
    disabled: campaign.disabled,
    start_at: campaign.start_at,
    holder_of: campaign.holder_of,

    // would be nice if we could get this from the onchain
    price: campaign.price,
    creator: campaign.creator,
  }

  const address = campaign.collection
  if (!address) {
    return
  }

  // get some onchain data
  const { maxSupply: supply, minted, metadata } = isEvm ? await evmCollection(address as `0x${string}`, usePrefix().urlPrefix.value) : await subCollection(address)
  const onChainData = {
    max: supply,
    minted: minted,
    name: metadata.name,
    collectionName: metadata.name,
    collectionDescription: metadata.description,
    image: metadata.image,
    banner: metadata.banner || metadata.image,
    content: metadata.generative_uri || campaign.content,
  }

  return { ...offChainData, ...onChainData }
}
