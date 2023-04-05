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
import {
  StarIcon,
  HeartIcon as HeartSolidIcon
} from '@heroicons/vue/24/solid';

import {
  HeartIcon,
} from '@heroicons/vue/24/outline';

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
        <HeartSolidIcon
          v-if="isInWishlist"
          class="h-5 w-5 c-red-500"
        />
        <HeartIcon
          v-else
          class="h-5 w-5"
        />
        <template #placeholder>
          <HeartIcon class="h-5 w-5" />
        </template>
      </client-only>
    </button>
    <div class="aspect-[2/3] w-full overflow-hidden bg-gray-300">
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
            class="line-clamp-2 h-6 font-medium text-base text-start"
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
        <div class="flex items-center">
          <div class="flex">
            <StarIcon
              v-for="value in ratingAverage"
              class="w-4 h-4 text-black"
            />
            <StarIcon
              v-for="value in (5 - ratingAverage)"
              class="w-4 h-4 text-gray-300"
            />
          </div>
          <span class="pl-1.5 text-sm">(8)</span>
        </div>
      </div>
    </div>
  </div>
</template>
