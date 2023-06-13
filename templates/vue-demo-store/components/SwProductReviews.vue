<script setup lang="ts">
import { Product, ProductReview } from "@shopware-pwa/types";
import {
  CheckCircleIcon,
  ArrowLeftIcon
} from '@heroicons/vue/24/outline';
import SharedReviews from './shared/SharedReviews.vue';
import SwPagination from './SwPagination.vue';
import { format } from "date-fns";

const props = defineProps<{
  product: Product;
  reviews?: ProductReview[];
}>();
const { product, reviews } = toRefs(props);

const shouldLoadReviews = !reviews?.value;

const loadingReviews = ref<boolean>(shouldLoadReviews);
const isAddReview = ref<boolean>(false);
const { loadProductReviews, productReviews } = useProductReviews(product);

onMounted(async () => {
  shouldLoadReviews && (await loadProductReviews());
  loadingReviews.value = false;
});

const reviewsList = computed<ProductReview[]>(
  () => {
    if (productReviews.value?.length) {
      return productReviews.value;
    }
    if (reviews?.value?.length) {
      return reviews?.value;
    }
    return [];
  }
);
const onAddReview = () => {
  isAddReview.value = true;
};

const formatDate = (date: string) => format(new Date(date), 'd LLL yyyy');
</script>

<template>
  <div
    v-if="loadingReviews"
    class="absolute inset-0 flex items-center justify-center z-10 bg-white/75"
  >
    <div
      class="h-15 w-15 i-carbon-progress-bar-round animate-spin c-gray-500"
    />
  </div>
  <div class="w-full md:w-1/2" v-if="!isAddReview">
    <div class="flex justify-between mb-6">
      <h4 class="text-xl md:text-2xl font-semibold">{{ reviewsList?.length }} Reviews</h4>
      <div class="flex flex-col">
        <SharedReviews :product="product" :numberOfReviews="reviewsList.length"/>
        <a class="underline text-right font-medium cursor-pointer" @click="onAddReview">Add review</a>
      </div>
    </div>
    <div class="p-4 mb-6 shadow-[0px_1px_0px_#F1F2F3]" v-for="review in reviewsList" :key="review.id">
      <div class="flex flex-col gap-2">
        <h6 class="text-base font-normal flex gap-1 items-center">
          <CheckCircleIcon class="h-6 w-6 text-gray-500"/> {{ review.customer?.firstName }} {{ review.customer?.lastName }}
        </h6>
        <SharedReviews :hideCount="true" :product="product" />
        <p class="text-gray-500">{{ formatDate(review.createdAt) }}</p>
      </div>
      <p class="mt-4 font-normal text-base">
        {{ review.content }}
      </p>
    </div>
    <!-- <div class="w-full justify-center flex pt-2 md:pt-0" v-if="reviewsList?.length">
      <SwPagination />
    </div> -->
  </div>
  <div v-else>
    <div class="cursor-pointer mb-5 flex text-gray-500" @click="isAddReview = false"><ArrowLeftIcon class="h-6 w-6 mr-2"/>Back to Reviews</div>
   <SwAddReview :product="product" />
  </div>
</template>
