import Event from '../../fragments/event'
import NftSubsquid from '../../fragments/nftSubsquid'

type MinimalEvent = Pick<Event, 'id' | 'meta'>
type NftEvents = { events: MinimalEvent[] }

type ProfileStatsByIdRefined = {
  listed: NftEvents[]
  obtained: { totalCount: number }
  sold: MinimalEvent[]
  invested: (Event & { nft: NftSubsquid })[]
}

export default ProfileStatsByIdRefined
