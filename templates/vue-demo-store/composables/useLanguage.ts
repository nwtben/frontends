import {
  getAvailableLanguages,
  setCurrentLanguage,
} from "@shopware-pwa/api-client";
import { EntityResult, Language, SessionContext } from "@shopware-pwa/types";

export function useLanguage() {
  const { apiInstance } = useShopwareContext();
  const { refreshSessionContext } = useSessionContext();
  const { availableLocales } = useI18n({ useScope: 'global' });
  
  const languages = useState<Language[]>('languages', () => []);
  const currentLanguage = useState<Language>('current-language');

  const fetchLang = async () => {
    const response: EntityResult<"language", Language> = await getAvailableLanguages(apiInstance);
    languages.value = response.elements;
  }

  const setLanguage = async (languageId: string) => {
    const localesRegex = new RegExp(`/${availableLocales.join('|')}`);
    const { origin, pathname } = location;
    const lang = languages.value.find(x => x.id === languageId)!;
    const code = lang.translationCode?.code === 'sv-SE' ? '' : `/${lang.translationCode?.code}`;
    const checkPath = pathname.replace(localesRegex, '') || '/';
    location.href = `${origin}${code}${checkPath}`;
  };

  const syncLanguageData = async (sessionContext: SessionContext) => {
    if (!sessionContext) return;
    const path = location.pathname.split('/').filter(x => !!x && availableLocales?.includes(x));
    const domain = sessionContext.salesChannel.domains.find(x => x.url === `${location.origin}${ path[0] ? ('/' + path[0]) : '' }`);
    currentLanguage.value = languages.value.find(x => x.id === domain?.languageId)!;
    if (currentLanguage.value) {
      await setCurrentLanguage(currentLanguage.value.id, apiInstance);
      apiInstance.config.languageId = currentLanguage.value.id;
    }
    await refreshSessionContext();
  };

  return {
    fetchLang,
    languages: computed(() => languages.value),
    setLanguage,
    currentLanguage: computed(() => currentLanguage.value),
    syncLanguageData
  }
}



