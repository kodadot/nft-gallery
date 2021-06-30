import i18n from '@/i18n';
import { Column } from './types';

export const columns: Column[] = [
  { field: 'id', label: i18n.t('spotlight.id') },
  { field: 'sold', label: i18n.t('spotlight.sold'), numeric: true },
  { field: 'unique', label: i18n.t('spotlight.unique'), numeric: true },
  { field: 'total', label: i18n.t('spotlight.total'), numeric: true },
  { field: 'averagePrice', label: i18n.t('spotlight.averagePrice'), numeric: true },
  { field: 'count', label: i18n.t('spotlight.count'), numeric: true },
  { field: 'collectors', label: i18n.t('spotlight.collectors'), numeric: true },
  { field: 'rank', label: i18n.t('spotlight.rank'), numeric: true },
]
