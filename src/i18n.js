import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// import all files
import enCommon from "./i18n/en/common.json";
import enSettings from "./i18n/en/settings.json";
import enStaff from "./i18n/en/staff.json";
import enIssues from "./i18n/en/issues.json";
import enSidebar from "./i18n/en/sidebar.json";
import enHotels from "./i18n/en/hotels.json";
import enManagers from "./i18n/en/managers.json";
import enDashboard from "./i18n/en/dashboard.json";
import enCms from "./i18n/en/cms.json";


import frCommon from "./i18n/fr/common.json";
import frSettings from "./i18n/fr/settings.json";
import frStaff from "./i18n/fr/staff.json";
import frIssues from "./i18n/fr/issues.json";
import frSidebar from "./i18n/fr/sidebar.json";
import frHotels from "./i18n/fr/hotels.json";
import frManagers from "./i18n/fr/managers.json";
import frDashboard from "./i18n/fr/dashboard.json";
import frCms from "./i18n/fr/cms.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        settings: enSettings,
        staff: enStaff,
        issues: enIssues,
        sidebar: enSidebar,
        hotels: enHotels,
        managers: enManagers,
        dashboard: enDashboard,
        cms: enCms
      },
      fr: {
        common: frCommon,
        settings: frSettings,
        staff: frStaff,
        issues: frIssues,
        sidebar: frSidebar,
        hotels: frHotels,
        managers: frManagers,
        dashboard: frDashboard,
        cms: frCms
      }
    },

    lng: "en", // default language
    fallbackLng: "en",

    ns: ["common", "settings", "staff", "issues", "sidebar", "hotels", "managers", "dashboard", "cms"], // namespaces
    defaultNS: "common",

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;