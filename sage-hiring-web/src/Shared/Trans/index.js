
import React from 'react';
import i18next from 'i18next';
import { initReactI18next, Trans } from 'react-i18next';
import ptBr from '../../Translations/PtBr/translations.json';

i18next
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': {
        translation: ptBr,
      },
    },
    lng: 'pt-BR',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export const t = (...props) => i18next.t(...props);
export default ({ i18nKey, count, values }) => (
  <Trans
    i18nKey={i18nKey}
    count={count}
    values={values}
  />
);
