<script setup lang="ts">
import { RouterLink } from "vue-router";

const { count } = useCart();
const { count: wishlistCount } = useWishlist();
const isSidebarOpen = inject("isSidebarOpen");
</script>

<template>
  <div class="relative border-b-2 border-gray-100">
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
            <RouterLink to="/">
              <span class="sr-only">LUXED</span>
              <img
                class="h-5 w-auto"
                src="/logo.svg"
                alt="Logo"
              >
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
                class="w-7 h-7 i-carbon-favorite text-gray-600 hover:text-brand-primary"
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
                class="w-7 h-7 i-carbon-shopping-cart text-gray-600 hover:text-brand-primary"
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
            <RouterLink to="/">
              <span class="sr-only">LUXED</span>
              <img
                class="h-5 w-auto"
                src="/logo.svg"
                alt="Logo"
              >
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
                class="w-7 h-7 i-carbon-favorite text-gray-600 hover:text-brand-primary"
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
                class="w-7 h-7 i-carbon-shopping-cart text-gray-600 hover:text-brand-primary"
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
