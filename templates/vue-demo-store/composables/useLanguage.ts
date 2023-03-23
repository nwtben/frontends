import {
  getAvailableLanguages,
  setCurrentLanguage,
} from "@shopware-pwa/api-client";
import { EntityResult, Language } from "@shopware-pwa/types";

export function useLanguage() {
  const { apiInstance } = useShopwareContext();
  const { refreshSessionContext, sessionContext } = useSessionContext();
  const { locale } = useI18n();
  
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

  watch(currentLanguage, () => {
    locale.value = currentLanguage.value?.locale?.code || '';
  });
  
  watch(
    () => sessionContext.value?.salesChannel?.languageId,
    async (newLanguageId) => {
      syncLanguageData(newLanguageId!);
    },
    {
      immediate: true
    }
  );

  return {
    fetchLang,
    languages: computed(() => languages.value),
    setLanguage,
    currentLanguage
  }
}



