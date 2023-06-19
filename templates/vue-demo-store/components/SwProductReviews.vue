<script setup lang="ts">
import { Product, ProductReview } from "@shopware-pwa/types";
import {
  CheckCircleIcon,
  ArrowLeftIcon
} from '@heroicons/vue/24/outline';
import SharedReviews from './shared/SharedReviews.vue';
import SwPagination from './SwPagination.vue';
import { format } from "date-fns";
import { InformationCircleIcon, ExclamationTriangleIcon, CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/vue/20/solid';
import { SharedModal } from "./shared/SharedModal.vue";
import { ReviewStar } from "~~/models/enum";

const props = defineProps<{
  product: Product;
  reviews?: ProductReview[];
  customerReview?: ProductReview;
  ratingMatrix? : any;
}>();
console.log(props.ratingMatrix);
const { product, reviews } = toRefs(props);
const modal = inject<SharedModal>("modal") as SharedModal;
const shouldLoadReviews = !reviews?.value;
const { isLoggedIn, user } = useUser();
const loadingReviews = ref<boolean>(shouldLoadReviews);
const isAddReview = ref<boolean>(false);
const justAddedReview = ref<boolean>(false);
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

const onHandleReview = () => {
  if (isAddReview.value) {
    isAddReview.value = false;
  } else {
    if (isLoggedIn.value) {
      isAddReview.value = true;
    } else {
      modal.open('AccountLoginForm');
    }
  }
};

const handleCancel = () => {
  isAddReview.value = false;
};

const handleSubmit = () => {
  justAddedReview.value = true;
  setTimeout(() => {
    justAddedReview.value = false;
  }, 1000)
}

const getMatrixPercent = (index: number) => {
  const total = props.ratingMatrix.reduce((sum: number, x: any) => {
    sum = sum + +x.count;
    return sum;
  }, 0);
  const currentReview = props.ratingMatrix.find((x: any) => +x.key === 5 - index)?.count || 0;
  return (currentReview / total) * 100;
}

const formatDate = (date: string) => format(new Date(date), 'd LLL yyyy');
const reviewStars = computed(() => {
  return Object.values(ReviewStar).filter((v) => isNaN(Number(v))).reverse();
})
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
  <div class="flex gap-4 md:gap-8">
    <div class="w-1/3">
      <h4 class="text-base font-bold mb-2">{{ $t('of_reviews', [reviewsList?.length, reviewsList?.length]) }}</h4>
      <SharedReviews :product="product" :numberOfReviews="reviewsList.length"/>
      <div v-if="reviewsList?.length" class="border-y border-gray-300 my-8 py-4">
        <div class="flex py-2 justify-between items-center" v-for="(reviewStar, index) of reviewStars">
          <SharedCheckbox class="w-1/4" :content="$t(reviewStar as string)" />
          <div class="w-2/3 flex justify-between items-center">
            <div class="w-full h-3 bg-neutral-200 dark:bg-neutral-600">
              <div class="h-3 bg-brand-primary" :style="{
                width: `${getMatrixPercent(index)}%`
              }"></div>
            </div>
            <span class="w-[70px] text-end">{{ getMatrixPercent(index) }}%</span>
          </div>
        </div>
      </div>
      <h5 class="text-lg font-bold mb-2">{{ !customerReview ? $t('leave_a_review') : $t('edit_your_review') }}</h5>
      <p class="text-sm mb-4">{{ $t('share_exp') }}</p>
      <button 
        class="flex items-center justify-center px-4 py-2 text-sm font-medium text-white shadow-sm bg-gray-800"
        @click="onHandleReview"
      >
        {{ !isAddReview ? (customerReview ? $t('edit_review') : $t('write_review')) : $t('show_review') }}
      </button>
    </div>
    <div class="w-2/3">
      <div v-if="justAddedReview" class="rounded-md bg-green-50 p-4 mb-8">
        <div class="flex">
          <div class="flex-shrink-0">
            <CheckCircleSolidIcon class="h-5 w-5 text-green-400" aria-hidden="true" />
          </div>
          <div class="ml-3 text-sm text-green-700">
            <p>{{ $t('thanks_for_review') }}</p>
          </div>
        </div>
      </div>
      <template v-if="!isAddReview">
        <template v-if="!reviewsList?.length">
          <div class="rounded-md bg-blue-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <InformationCircleIcon class="h-5 w-5 text-blue-400" aria-hidden="true" />
              </div>
              <div class="ml-3 flex-1 md:flex md:justify-between">
                <p class="text-sm text-blue-700">{{ $t('no_reviews') }}</p>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="py-4 mb-6 shadow-[0px_1px_0px_#F1F2F3]" v-for="review in reviewsList" :key="review.id">
            <div class="flex flex-col gap-2">
              <div class="rounded-md bg-yellow-50 p-4" v-if="!review.status">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  </div>
                  <div class="ml-3 flex-1 md:flex md:justify-between">
                    <p class="text-sm text-yellow-800">Your review has not been approved yet</p>
                  </div>
                </div>
              </div>
              <p class="text-gray-500">{{ formatDate(review.createdAt) }}</p>
              <h6 class="text-base font-normal flex gap-1 items-center">
                <SwRating class="justify-end" :rating="review.points" />
                <span class="font-medium">{{ review.title }}</span>
              </h6>
            </div>
            <p class="mt-4 font-normal text-base break-words">
              {{ review.content }}
            </p>
          </div>
        </template>
      </template>
      <template v-else>
        <SwAddReview :product="product" @cancel="handleCancel" @submit="handleSubmit" />
      </template>
    </div>
  </div>
  <!-- <div class="w-full md:w-1/2" v-if="!isAddReview">
    <div class="flex justify-between mb-6">
      <h4 class="text-xl md:text-2xl font-semibold">{{ reviewsList?.length }} Reviews</h4>
      <div class="flex flex-col">
        <a class="underline text-right font-medium cursor-pointer" @click="onAddReview">Add review</a>
      </div>
    </div>
    <div class="p-4 mb-6 shadow-[0px_1px_0px_#F1F2F3]" v-for="review in reviewsList" :key="review.id">
      <div class="flex flex-col gap-2">
        <h6 class="text-base font-normal flex gap-1 items-center">
          <CheckCircleIcon class="h-6 w-6 text-gray-500"/> {{ review.title }}
        </h6>
        <SharedReviews class="justify-end" :hideCount="true" :product="product" />
        <p class="text-gray-500 text-right">{{ formatDate(review.createdAt) }}</p>
      </div>
      <p class="mt-4 font-normal text-base">
        {{ review.content }}
      </p>
    </div>
  </div>
  <div v-else>
    <div class="cursor-pointer mb-5 flex text-gray-500" @click="isAddReview = false"><ArrowLeftIcon class="h-6 w-6 mr-2"/>Back to Reviews</div>
   <SwAddReview :product="product" />
  </div> -->
</template>
