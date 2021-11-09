import { TranslateResult } from 'vue-i18n'
import { Interaction } from '../rmrk/service/scheme'

export type Column = {
  field: keyof Row;
  label: string | TranslateResult;
  width?: number;
  numeric?: boolean;
  centered?: boolean;
}

type VolumeType = number | bigint;

export type Row = {
  id: string;
  unique: number;
  sold: number;
  total: number;
  averagePrice: number;
  count: number;
  collectors: number;
  rank: number;
  volume: VolumeType;
};

export type SimpleSpotlightNFT = {
  issuer: string;
  currentOwner: string;
  metadata: string;
  price: number;
  events: Interaction[];
};
