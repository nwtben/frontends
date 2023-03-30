<script setup lang="ts">
import { getSessionContext } from "@shopware-pwa/api-client";
import { SessionContext } from "@shopware-pwa/types";

/**
 * Init breadcrumbs context
 */
useBreadcrumbs();

useHead({
  title: "Shopware Demo store",
  meta: [{ name: "description", content: "Shopware Demo store" }],
  htmlAttrs: {
    lang: "en",
  },
});

const { refreshSessionContext } = useSessionContext();
onBeforeMount(async () => {
  await refreshSessionContext();
  getWishlistProducts();
});

const { apiInstance } = useShopwareContext();
const { data: sessionContextData } = await useAsyncData(
  "sessionContext",
  async () => {
    return await getSessionContext(apiInstance);
  }
);
useSessionContext(sessionContextData.value as SessionContext);

const { getWishlistProducts } = useWishlist();
const { refreshCart } = useCart();

useNotifications();
useAddress();

onMounted(() => {
  refreshCart();
  getWishlistProducts();
});

const isSidebarOpen = ref(false);
provide("isSidebarOpen", isSidebarOpen);

const modalContent = ref<string>("");
const modalProps = ref<object | null | undefined>({});
const modalHandler = {
  open: (component: string, props?: object | null) => {
    modalContent.value = component;
    modalProps.value = props;
  },
  close: () => {
    modalContent.value = "";
    modalProps.value = {};
  },
};

provide("modal", { modalContent, modalProps, ...modalHandler });

const isSideMenuOpened = ref(false);
provide("isSideMenuOpened", isSideMenuOpened);
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  @apply text-brand-dark;
}

h2 {
  @apply text-4xl py-4;
}
h3 {
  @apply text-3xl py-3;
}
h4 {
  @apply text-2xl py-3;
}
h5 {
  @apply text-xl;
}
h6 {
  @apply text-lg font-medium;
}
</style>
