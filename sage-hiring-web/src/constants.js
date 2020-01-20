import { t } from './Shared/Trans';

export const ADDRESS_FIELDS = [
  { field: 'title', label: t('Address title'), placeholder: t('For example, Home') },
  { field: 'street', label: t('Street') },
  { field: 'streetNumber', label: t('Street number') },
  { field: 'additional', label: t('Additional address') },
  { field: 'district', label: t('District') },
  { field: 'city', label: t('City') },
  { field: 'state', label: t('State') },
  { field: 'country', label: t('Country') },
];

export default ADDRESS_FIELDS;
