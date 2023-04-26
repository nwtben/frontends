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

const handleScroll = () => {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    headerMode.value = 'default';
  } else {
    headerMode.value = 'transparent';
  }
}

const controlState = () => {
  if (path.value === '/') {
    showBreadCrumb.value = false;
    headerMode.value = 'transparent';
    window.addEventListener('scroll', handleScroll);
  } else if (path.value === '/checkout/cart') {
    showBreadCrumb.value = false;
    headerMode.value = 'default';
    window.removeEventListener('scroll', handleScroll);
  }else {
    showBreadCrumb.value = true;
    headerMode.value = 'default';
    window.removeEventListener('scroll', handleScroll);
  }
}

watch(path, () => {
  controlState();
});

onMounted(() => {
  controlState();
})
</script>
<template>
  <div>
    <SharedModal />
    <LayoutHeader />
    <LayoutNotifications />
    <div class="min-h-[50vh] mx-auto">
      <LayoutBreadcrumbs v-if="showBreadCrumb" />
      <slot />
    </div>
    <CheckoutSideCart />
    <LayoutFooter />
  </div>
</template>
