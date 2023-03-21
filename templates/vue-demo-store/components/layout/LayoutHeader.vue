<script setup lang="ts">
import { RouterLink } from "vue-router";

const { count } = useCart();
const { count: wishlistCount } = useWishlist();
const isSidebarOpen = inject("isSidebarOpen");
const headerMode = useState<'default' | 'transparent'>('headerMode', () => 'default');
const route = useRoute();

const path = computed(() => route.path || '');

const handleScroll = () => {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    headerMode.value = 'default';
  } else {
    headerMode.value = 'transparent';
  }
}

const controlHeader = () => {
  if (path.value === '/') {
    headerMode.value = 'transparent';
    window.addEventListener('scroll', handleScroll);
  } else {
    headerMode.value = 'default';
    window.removeEventListener('scroll', handleScroll);
  }
}

watch(path, () => {
  controlHeader();
});

onMounted(() => {
  controlHeader();
})

</script>

<template>
  <div :class="{
    'z-10 transition': true,
    'text-white bg-transparent fixed w-full': headerMode === 'transparent',
    'sticky top-0 relative bg-white border-b-2 border-gray-100 text-brand-dark': headerMode === 'default',
  }">
    <!-- For Desktop -->
    <div class="hidden lg:block container mx-auto">
      <div class="flex justify-end">
        <LayoutLanguage />
      </div>
      <div
        class="flex justify-between items-center pb-3 space-x-4"
      >
        <div class="flex-[2_2_0%]">
          <LayoutTopNavigation />
        </div>
        <div class="flex-1 flex justify-center">
          <div>
            <RouterLink to="/" class="text-current">
              <span class="sr-only">LUXED</span>
              <div class="text-current w-40 i-custom:logo" />
            </RouterLink>
          </div>
        </div>

        <div class="flex-[2_2_0%] flex gap-4 items-center justify-end">
          <LayoutStoreSearch />
          <AccountMenu />
          <div class="flex flow-root">
            <button
              class="group -m-2 p-2 flex items-center relative"
              aria-label="wishlist"
              data-testid="wishlist-button"
              @click="$router.push('/wishlist')"
            >
              <div
                class="w-7 h-7 i-carbon-favorite text-current hover:text-brand-primary"
              />
              <span
                v-if="wishlistCount > 0"
                class="text-3 font-sm text-white absolute bg-red-500 rounded-full min-w-5 min-h-5 top-0 right-0 leading-5"
              >
                {{ wishlistCount }}
              </span>
            </button>
          </div>
          <!-- Cart -->
          <div class="flex flow-root">
            <button
              class="group -m-2 p-2 flex items-center relative"
              aria-label="cart"
              data-testid="cart-button"
              @click="isSidebarOpen = true"
            >
              <!-- Heroicon name: outline/shopping-bag -->
              <div
                class="w-7 h-7 i-carbon-shopping-cart text-current hover:text-brand-primary"
              />
              <span
                v-if="count > 0"
                class="text-3 font-sm text-white absolute bg-blue rounded-full min-w-5 min-h-5 top-0 right-0 leading-5"
              >
                {{ count || "" }}
              </span>
              <span class="sr-only">items in cart, view bag</span>
            </button>
          </div>
        </div>

      </div>
    </div>
    <!-- For Mobile -->
    <div class="block lg:hidden container mx-auto">
      <div
        class="flex justify-between items-center py-5 space-x-4"
      >
        <div class="flex-[2_2_0%] flex gap-4">
          <LayoutSideMenu />
          <AccountMenu />
        </div>
        <div class="flex-1 flex justify-center">
          <div>
            <RouterLink to="/" class="text-current">
              <span class="sr-only">LUXED</span>
              <div class="text-current w-40 i-custom:logo" />
            </RouterLink>
          </div>
        </div>

        <div class="flex-[2_2_0%] flex gap-4 items-center justify-end">
          <!-- <LayoutStoreSearch /> -->
          <div class="flex flow-root">
            <button
              class="group -m-2 p-2 flex items-center relative"
              aria-label="wishlist"
              data-testid="wishlist-button"
              @click="$router.push('/wishlist')"
            >
              <div
                class="w-7 h-7 i-carbon-favorite text-current hover:text-brand-primary"
              />
              <span
                v-if="wishlistCount > 0"
                class="text-3 font-sm text-white absolute bg-red-500 rounded-full min-w-5 min-h-5 top-0 right-0 leading-5"
              >
                {{ wishlistCount }}
              </span>
            </button>
          </div>
          <!-- Cart -->
          <div class="flex flow-root">
            <button
              class="group -m-2 p-2 flex items-center relative"
              aria-label="cart"
              data-testid="cart-button"
              @click="isSidebarOpen = true"
            >
              <!-- Heroicon name: outline/shopping-bag -->
              <div
                class="w-7 h-7 i-carbon-shopping-cart text-current hover:text-brand-primary"
              />
              <span
                v-if="count > 0"
                class="text-3 font-sm text-white absolute bg-blue rounded-full min-w-5 min-h-5 top-0 right-0 leading-5"
              >
                {{ count || "" }}
              </span>
              <span class="sr-only">items in cart, view bag</span>
            </button>
          </div>
        </div>

      </div>
      <LayoutStoreSearch class="w-full mb-3" />
    </div>
  </div>
</template>
