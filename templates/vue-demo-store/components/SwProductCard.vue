<script setup lang="ts">
import { RouterLink } from "vue-router";
import {
  BoxLayout,
  DisplayMode,
  // useProductPrice,
} from "@shopware-pwa/composables-next";
import {
  getProductName,
  getProductThumbnailUrl,
  getProductUrl,
  // getTranslatedProperty,
  getProductFromPrice,
} from "@shopware-pwa/helpers-next";
import {
  ClientApiError,
  Product,
  // PropertyGroupOption,
} from "@shopware-pwa/types";
import { Ref } from "vue";
import SwListingProductPrice from "./SwListingProductPrice.vue";

const { pushSuccess, pushError } = useNotifications();

const props = withDefaults(
  defineProps<{
    product: Product;
    layoutType?: BoxLayout;
    isProductListing?: boolean;
    displayMode?: DisplayMode;
  }>(),
  {
    layoutType: "standard",
    displayMode: "standard",
    isProductListing: false,
  }
);
const { product } = toRefs(props);

const { addToCart } = useAddToCart(product);

const { addToWishlist, removeFromWishlist, isInWishlist } =
  useProductWishlist(product);

const toggleWishlistProduct = async () => {
  if (!isInWishlist.value) {
    try {
      await addToWishlist();
      return pushSuccess(
        `${props.product?.translated?.name} has been added to wishlist.`
      );
    } catch (error) {
      const e = error as ClientApiError;
      const reason = e?.messages?.[0]?.detail
        ? `Reason: ${e?.messages?.[0]?.detail}`
        : "";
      return pushError(
        `${props.product?.translated?.name} cannot be added to wishlist.\n${reason}`,
        {
          timeout: 5000,
        }
      );
    }
  }
  removeFromWishlist();
};

// const addToCartProxy = async () => {
//   await addToCart();
//   pushSuccess(`${props.product?.translated?.name} has been added to cart.`);
// };

// const fromPrice = getProductFromPrice(props.product);
const ratingAverage: Ref<number> = computed(() =>
  props.product.ratingAverage ? Math.round(props.product.ratingAverage) : 0
);
</script>

<template>
  <div
    class="sw-product-card group relative flex flex-col justify-between"
    data-testid="product-box"
  >
    <button
      aria-label="Add to wishlist"
      type="button"
      @click="toggleWishlistProduct"
      class="absolute top-2 right-2 rounded-full bg-white opacity-50 p-1"
      data-testid="product-box-toggle-wishlist-button"
    >
      <client-only>
        <div
          v-if="isInWishlist"
          class="h-5 w-5 i-carbon-favorite-filled c-red-500"
          data-testid="product-box-wishlist-icon-in"
        ></div>
        <div
          v-else
          class="h-5 w-5 i-carbon-favorite"
          data-testid="product-box-wishlist-icon-not-in"
        ></div>
        <template #placeholder>
          <div class="h-5 w-5 i-carbon-favorite"></div>
        </template>
      </client-only>
    </button>
    <div class="min-h-80 aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
      <img
        :src="getProductThumbnailUrl(product)"
        :alt="getProductName({ product }) || ''"
        class="h-full w-full object-cover object-center lg:h-full lg:w-full"
      />
    </div>
    <div class="mt-4 flex justify-between">
      <div>
        <h3 class="text-base p-0">
          <RouterLink
            class="line-clamp-2 h-6 font-medium text-base"
            :to="getProductUrl(product)"
            data-testid="product-box-product-name-link"
          >
            {{ getProductName({ product }) }}
          </RouterLink>
        </h3>
        <SwListingProductPrice
          :product="product"
          class="ml-auto"
          data-testid="product-box-product-price"
        />
        <div class="flex">
          <div
            v-for="value in ratingAverage"
            class="w-5 h-5 i-carbon-star-filled"
          ></div>
          <div
            v-for="value in (5 - ratingAverage)"
            class="w-5 h-5 i-carbon-star"
          ></div>
          <span class="pl-2">(8)</span>
        </div>
      </div>
    </div>
  </div>
</template>
