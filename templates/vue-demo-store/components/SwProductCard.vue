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
  Product,
  // PropertyGroupOption,
} from "@shopware-pwa/types";
import SwListingProductPrice from "./SwListingProductPrice.vue";
import {
  StarIcon,
  HeartIcon as HeartSolidIcon
} from '@heroicons/vue/24/solid';

import {
  HeartIcon,
} from '@heroicons/vue/24/outline';

const { pushSuccess, pushError } = useNotifications();
const router = useRouter();
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

const goToProductDetail =  () => {
  router.push(getProductUrl(product.value))
}
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
      class="absolute top-2 right-2 rounded-full bg-white bg-opacity-50 p-1"
      data-testid="product-box-toggle-wishlist-button"
    >
      <client-only>
        <HeartSolidIcon
          v-if="isInWishlist"
          class="h-6 w-6 text-gray-900"
        />
        <HeartIcon
          v-else
          class="h-6 w-6"
        />
        <template #placeholder>
          <HeartIcon class="h-6 w-6" />
        </template>
      </client-only>
    </button>
    <div class="aspect-[2/3] w-full overflow-hidden bg-gray-300 group-hover:opacity-75">
      <img
        @click="goToProductDetail"
        :src="getProductThumbnailUrl(product)"
        :alt="getProductName({ product }) || ''"
        class="cursor-pointer h-full w-full object-cover object-center lg:h-full lg:w-full"
      />
    </div>
    <div class="mt-4 flex justify-between">
      <div>
        <h3 class="text-base p-0">
          <a
            class="cursor-pointer line-clamp-1 h-6 font-medium text-sm md:text-base text-start"
            data-testid="product-box-product-name-link"
            @click="goToProductDetail"
          >
            {{ getProductName({ product }) }}
        </a>
        </h3>
        <SwListingProductPrice
          :product="product"
          class="ml-auto"
          data-testid="product-box-product-price"
        />
        <SharedReviews :product="product" />
      </div>
    </div>
  </div>
</template>
