<script lang="ts">
export default {
  name: "DefaultLayout",
};
</script>
<script setup lang="ts">
// Navigation for default theme
const { loadNavigationElements } = useNavigation();

const { data } = useAsyncData("mainNavigation", () => {
  return loadNavigationElements({ depth: 2 });
});
const showBreadCrumb = useState<boolean>('showBreadCrumb');

provide("swNavigation-main-navigation", data);

const { loadNavigationElements: loadFooterNavigationElements } = useNavigation({
  type: "footer-navigation",
});
const { data: footerData } = useAsyncData("mainFooterNavigation", () => {
  return loadFooterNavigationElements({ depth: 2 });
});
provide("swNavigation-footer-navigation", footerData);

// Canonical
const route = useRoute();
const runtimeConfig = useRuntimeConfig();
useHead({
  link: [
    {
      rel: 'canonical',
      href: runtimeConfig.public.shopwareStoreDomain + route.path,
    },
  ],
});

</script>
<template>
  <div>
    <SharedModal />
    <LayoutHeader />
    <LayoutNotifications />
    <div class="min-h-[100vh] mx-auto">
      <LayoutBreadcrumbs v-if="showBreadCrumb" />
      <slot />
    </div>
    <CheckoutSideCart />
    <LayoutFooter />
  </div>
</template>
