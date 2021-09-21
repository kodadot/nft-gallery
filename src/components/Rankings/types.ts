import { TranslateResult } from 'vue-i18n';

export type Column = {
  field: keyof Row;
  label: string | TranslateResult;
  width?: number;
  numeric?: boolean;
  centered?: boolean;
};

export type Row = {
  id: string;
  unique: number;
  image: any;
  metadata: string;
  sold: number;
  total: number;
  averagePrice: number;
  collectors: number;
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
