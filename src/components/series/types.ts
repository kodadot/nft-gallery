import { TranslateResult } from 'vue-i18n'

export type Column = {
  field: keyof RowSeries;
  label: string | TranslateResult;
  width?: number;
  numeric?: boolean;
  centered?: boolean;
};

export type SortType = {
  field: string;
  value: -1 | 1;
};

export type RowSeries = {
  id: string;
  unique: number;
  image: any;
  metadata: string;
  sold: number;
  total: number;
  volume: number;
  dailyVolume: number;
  weeklyVolume: number;
  monthlyVolume: number;
  averagePrice: number;
  floorPrice: number;
  rank: number;
  uniqueCollectors: number;
  name: string;
};

export type SimpleSeriesNFT = {
  issuer: string;
  currentOwner: string;
  metadata: string;
  price: number;
  events: [];
};
