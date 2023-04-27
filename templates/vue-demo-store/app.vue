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
const route = useRoute();
const path = computed(() => route.path || '');

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

const headerMode = useState<'default' | 'transparent'>('headerMode', () => 'default');
const showBreadCrumb = useState<boolean>('showBreadCrumb');

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
  } else {
    window.removeEventListener('scroll', handleScroll);
    showBreadCrumb.value = true;
    headerMode.value = 'default';
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
  <NuxtLayout v-if="sessionContext">
    <NuxtLoadingIndicator />
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

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
/* width */
::-webkit-scrollbar {
  width: 4px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px #F1F2F3; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #8D8F9A; 
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #8D8F9A; 
}
input[type='checkbox']:checked {
  background-color: currentColor;
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
  border: none;
}
input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}
</style>
