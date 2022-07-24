enum OfferStatusType {
  ACTIVE = 'ACTIVE',
  ACCEPTED = 'ACCEPTED',
  WITHDRAWN = 'WITHDRAWN',
}

enum SpecialOfferStatusType {
  ALL = 'ALL',
}

export type AllOfferStatusType = OfferStatusType | SpecialOfferStatusType
export const AllOfferStatusType = {
  ...OfferStatusType,
  ...SpecialOfferStatusType,
}
