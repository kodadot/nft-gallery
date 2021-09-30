import { TranslateResult } from 'vue-i18n'

export type Column = {
  field: keyof RowRanking;
  label: string | TranslateResult;
  width?: number;
  numeric?: boolean;
  centered?: boolean;
};

export type RowRanking = {
  id: string;
  unique: number;
  image: any;
  metadata: string;
  sold: number;
  total: number;
  volume: number;
  weeklyVolume: number;
  monthlyVolume: number;
  averagePrice: number;
  floorPrice: number;
  rank: number;
  uniqueCollectors: number;
  name: string;
};

export type SimpleRankingsNFT = {
  issuer: string;
  currentOwner: string;
  metadata: string;
  price: number;
  events: [];
};
