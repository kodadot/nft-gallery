import { TranslateResult } from 'vue-i18n';

export type Column = {
  field: string;
  label: string | TranslateResult;
  width?: number;
  numeric?: boolean;
  centered?: boolean;
}

export type Row = {
  id: string;
  unique: number;
  sold: number;
  total: number
}
