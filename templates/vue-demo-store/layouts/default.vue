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
const headLinks: any = [
  {
    rel: 'canonical',
    href: runtimeConfig.public.shopwareStoreDomain + route.path,
  },
];
if (route.path === '/') {
  headLinks.push({
    rel: "preload",
    as: "image",
    href: "https://shopware.nwtsaas.com.global.prod.fastly.net/media/bd/5f/85/1686677688/hero-desktop-511745398.jpg?format=webp&quality=85&effect=sharpen:100",
    imagesrcset: "https://shopware.nwtsaas.com.global.prod.fastly.net/thumbnail/bd/5f/85/1686677688/hero-desktop-511745398_400x400.jpg?format=webp&quality=85&effect=sharpen:100 400w, https://shopware.nwtsaas.com.global.prod.fastly.net/thumbnail/bd/5f/85/1686677688/hero-desktop-511745398_800x800.jpg?format=webp&quality=85&effect=sharpen:100 800w, https://shopware.nwtsaas.com.global.prod.fastly.net/thumbnail/bd/5f/85/1686677688/hero-desktop-511745398_1920x1920.jpg?format=webp&quality=85&effect=sharpen:100 1920w",
  })
}
useHead({
  link: headLinks
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
