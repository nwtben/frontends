<script setup lang="ts">
import 'vue3-carousel/dist/carousel.css';
import { VNodeArrayChildren } from "vue";
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
import {
  ArrowSmallLeftIcon,
  ArrowSmallRightIcon
} from '@heroicons/vue/24/outline'
const carouselEl = ref<any>(null);
const slots = useSlots();
const childrenRaw = computed(
  () => (slots?.default?.()[0].children as VNodeArrayChildren) ?? []
);

const gap = ref(16);

const breakpoints = ref({
  700: {
    itemsToShow: 4,
  },
})

const next = () => {
  carouselEl.value.next();
}

const prev = () => {
  carouselEl.value.prev();
}

</script>
<template>
  <div class="relative">
    <button class="hidden md:flex z-50 absolute top-1/2 left-0 trasform -translate-x-1/2 bg-gray-100 rounded-full h-10 w-10 justify-center items-center" @click="prev"><ArrowSmallLeftIcon class="h-5 w-5" /></button>
    <carousel ref="carouselEl" :snapAlign="'start'" :itemsToShow="2.5" :itemsToScroll="1" :breakpoints="breakpoints" :style="{marginLeft: `-${gap}px`, marginRight: `-${gap}px`}">
      <slide v-for="(child, index) of childrenRaw" :key="index" :style="{padding: `0 ${gap}px`}">
        <component :is="child" />
      </slide>
      <template #addons>
        <Pagination :style="{paddingLeft: `${gap}px`, paddingRight: `${gap}px`}"/>
      </template>
    </carousel>
    <button class="hidden md:flex z-50 absolute top-1/2 right-0 trasform translate-x-1/2 bg-gray-100 rounded-full h-10 w-10 justify-center items-center" @click="next"><ArrowSmallRightIcon class="h-5 w-5" /></button>
  </div>
</template>
<style>
.carousel__pagination {
  @apply flex mt-10 md:mt-13;
}
.carousel__pagination-item {
  @apply flex-1;
}
.carousel__pagination-button {
  @apply w-full p-0;
}
.carousel__pagination-button::after {
  @apply w-full bg-light-primary;
  height: 2px;
}
.carousel__pagination-button--active::after {
  @apply bg-dark-primary;
}

</style>
