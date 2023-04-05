<script setup lang="ts">
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

const { sessionContext, refreshSessionContext } = useSessionContext();
onBeforeMount(async () => {
  await refreshSessionContext();
  getWishlistProducts();
});
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
  <NuxtLayout v-if="sessionContext">
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
:root {
  font-family: 'Inter', sans-serif;
  @apply text-gray-900;
}

h2 {
  @apply text-4xl;
}
h3 {
  @apply text-2xl md:text-3xl;
}
h4 {
  @apply text-2xl;
}
h5 {
  @apply text-xl;
}
h6 {
  @apply text-lg font-medium;
}
</style>
