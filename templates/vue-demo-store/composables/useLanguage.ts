import {
  getAvailableLanguages,
  setCurrentLanguage,
} from "@shopware-pwa/api-client";
import { EntityResult, Language } from "@shopware-pwa/types";

export function useLanguage() {
  const { apiInstance } = useShopwareContext();
  const { refreshSessionContext } = useSessionContext();
  
  const languages = useState<Language[]>('languages', () => []);
  const currentLanguage = ref<Language>();

  const fetchLang = async () => {
    const response: EntityResult<"language", Language> = await getAvailableLanguages(apiInstance);
    languages.value = response.elements;
  }

  const setLanguage = async (languageId: string) => {
    await setCurrentLanguage(languageId, apiInstance);
    refreshSessionContext();
  };

  const syncLanguageData = async (languageId: string) => {
    const response = await apiInstance.invoke.post<
      EntityResult<"language", Language[]>
    >("/store-api/language", {
      filter: [
        {
          type: "equals",
          field: "id",
          value: languageId,
        },
      ],
      associations: {
        locale: {},
      },
    });
    currentLanguage.value = response.data.elements?.[0];
  };

  return {
    fetchLang,
    languages: computed(() => languages.value),
    setLanguage,
    currentLanguage,
    syncLanguageData
  }
}



