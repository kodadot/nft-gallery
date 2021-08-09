export const Conditions: string[] = [
  'POPULAR',
  'Editions',
  'RECENTLY SOLD',
  'NEW',
  'ON SALE'
];

export const Varities: string[] = [
  'ARTWORKS',
  'CREATORS',
  'COLLECTORS'
];

export const Mediums: string[] = [
  'ANIMATION',
  'ILLUSTRATION',
  'CCALLIGRAPHY',
  'PHOTOGRAPHY',
  'MUSIC',
  'FASHION',
  'SPATIAL',
  'PHYSICAL OBJECTS',
  'TEXT',
  'PAINTING'
];

export const Filters: string[] = [
  'PRICE (HIGH/LOW)',
  'PRICE (LOW/HIGH)',
  'EDITIONS (MORE/LESS)',
  'EDITIONS (LESS/MORE)',
  'AGE (NEW/OLD)',
  'AGE (OLD/NEW)'
];

export type QueryType = Record<string, unknown>

export type SortType = {
  field: string,
  value: -1 | 1
}

export type SortBy = Record<string, number>;

export type SearchQuery = {
  search: string;
  type?: string;
  sortBy?: SortBy;
}

export type StringOrNull = string | null;

export const exist = (value: string | StringOrNull[], cb: (arg: string) => void) => {
  if (value && typeof value === 'string') {
    cb(value);
  }
};
