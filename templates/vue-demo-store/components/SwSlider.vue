<script setup lang="ts">
import 'vue3-carousel/dist/carousel.css';
import { VNodeArrayChildren } from "vue";
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
import {
  ArrowSmallLeftIcon,
  ArrowSmallRightIcon
} from '@heroicons/vue/24/outline';

interface ScreenGap {
  screen: number;
  gap: string
}

const props = withDefaults(
  defineProps<{
    itemsToScroll: number;
    itemsToShow: number;
    snapAlign?: string;
    breakpoints?: any;
    gap?: string;
    navigationDots?: string;
    navigationArrows?: string;
    mouseDrag?: boolean;
    touchDrag?: boolean;
    dynamicHeight?: boolean;
    currentSlideIndex?: number;
    fullContentMobile?: boolean;
  }>(),
  {
    snapAlign: 'start',
    breakpoints: {},
    mouseDrag: true,
    touchDrag: true,
    currentSlideIndex: 0
  }
);

const carouselEl = ref<any>(null);
const gap = ref();
const slots = useSlots();
const childrenRaw = computed(
  () => (slots?.default?.()[0].children as VNodeArrayChildren) ?? []
);


const breakpoints = ref({
  768: {
    itemsToShow: 4,
    itemsToScroll: 2
  },
})

const next = () => {
  carouselEl.value.next();
}

const prev = () => {
  carouselEl.value.prev();
}

const currentSlide = ref(0);
</script>
<template>
  <div class="relative">
    <button v-if="currentSlide > 0" class="hidden md:flex z-40 absolute top-1/2 left-0 trasform -translate-x-1/2 bg-gray-100 rounded-full h-10.5 w-10.5 justify-center items-center" @click="prev"><ArrowSmallLeftIcon class="h-6 w-6" /></button>
    <carousel v-model="currentSlide" ref="carouselEl" :snapAlign="'start'" :itemsToShow="2.5" :itemsToScroll="1" :breakpoints="breakpoints">
      <slide v-for="(child, index) of childrenRaw" :key="index">
        <component :is="child" />
      </slide>
      <template #addons>
        <Pagination />
      </template>
    </carousel>
    <button v-if="carouselEl?.data?.config.itemsToShow + currentSlide < childrenRaw.length" class="hidden md:flex z-40 absolute top-1/2 right-0 trasform translate-x-1/2 bg-gray-100 rounded-full h-10.5 w-10.5 justify-center items-center" @click="next"><ArrowSmallRightIcon class="h-6 w-6" /></button>
  </div>
</template>
<style>
.carousel {
  @apply -mx-4;
}
.carousel__slide {
  @apply px-2 sm:px-4;
}
.carousel__track {
  @apply px-2! sm:px-0!;
}
.carousel__pagination {
  @apply flex mt-10 md:mt-13 px-4;
}
.carousel__pagination__outside .carousel__pagination-item {
  @apply flex-1;
}
.carousel__pagination__outside .carousel__pagination-button {
  @apply w-full p-0;
}
.carousel__pagination__outside .carousel__pagination-button::after {
  @apply w-full bg-light-primary;
  height: 2px;
}
.carousel__pagination__outside .carousel__pagination-button--active::after {
  @apply bg-dark-primary;
}

/* custom pagination inside */
.carousel__pagination__inside {
  @apply absolute bottom-2 left-1/2 translate -translate-x-1/2
}
.carousel__pagination__inside .carousel__pagination-button {
  padding: 2px;
}
.carousel__pagination__inside .carousel__pagination-button::after {
  @apply bg-gray-100 w-4;
  height: 2px;
}
.carousel__pagination__inside .carousel__pagination-button--active::after {
  @apply bg-gray-900;
}

</style>
