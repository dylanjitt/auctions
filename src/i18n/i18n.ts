
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { enJSON } from './en';
import { esJSON} from "./es"

i18n
  .use(initReactI18next)
  .init({
    lng: "es",
    fallbackLng: "es",
    debug: true, // helpful for debugging
    resources: {
      en: {
        translation: enJSON
      },
      es: {
        translation: esJSON
      }
    }
  });

export default i18n;