import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enCommon from "./locales/en/common.json";
import hiCommon from "./locales/hi/common.json";
import frCommon from "./locales/fr/common.json";

const resources = {
  en: {
    translation: enCommon,
  },
  hi: {
    translation: hiCommon,
  },
  fr: {
    translation: frCommon,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("language") || "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
