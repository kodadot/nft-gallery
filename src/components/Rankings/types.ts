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
  sold: number;
  total: number;
  averagePrice: number;
  count: number;
  collectors: number;
  rank: number;
};

export type SimpleRankingsNFT = {
  issuer: string;
  currentOwner: string;
  metadata: string;
  price: number;
  events: [];
};
