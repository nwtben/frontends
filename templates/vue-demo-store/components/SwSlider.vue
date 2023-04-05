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

const breakpointsGap = computed<ScreenGap[] | null>(() => {
  let screensize: ScreenGap[] = [];
  Object.keys(props.breakpoints).forEach(x => {
    if (props.breakpoints[x].gap) {
      screensize.push({ 
        screen: +x,
        gap: props.breakpoints[x].gap 
      });
    }
  })
  return screensize.length ? screensize : null;
});

const settings = computed(() => ({
  itemsToScroll: props.itemsToScroll,
  snapAlign: props.snapAlign,
  itemsToShow: props.itemsToShow,
  breakpoints: props.breakpoints,
  mouseDrag: props.mouseDrag,
  touchDrag: props.touchDrag,
}));

const resizeHandler = useDebounceFn((e: any) => {
  const screenwidth = e.target.innerWidth;
  handleGap(screenwidth);
}, 500);

const handleGap = (screenwidth: number) => {
  const screens = breakpointsGap.value?.map(x => x.screen).sort().reverse() || [];
  let screen;
  for (let i = 0; i <= screens.length; i++) {
    if (screenwidth < screens[i]) continue;
    if (screenwidth >= screens[i]) {
      gap.value = breakpointsGap.value?.[i].gap;
      screen = screens[i];
      break;
    }
  }
  if (!screen) {
    gap.value = props.gap;
  }
}

onMounted(() => {
  handleGap(window.innerWidth);
  if (breakpointsGap.value) {
    window.addEventListener('resize', resizeHandler);
  }
});

onUnmounted(() => {
  if (breakpointsGap.value) {
    window.removeEventListener('resize', resizeHandler);
  }
});

const next = () => {
  carouselEl.value.next();
}

const prev = () => {
  carouselEl.value.prev();
}
</script>
<template>
  <div class="relative">
    <button v-if="props.navigationArrows"  class="hidden md:flex z-40 absolute top-1/2 left-0 trasform -translate-x-1/2 bg-gray-100 rounded-full h-10 w-10 justify-center items-center" @click="prev"><ArrowSmallLeftIcon class="h-5 w-5" /></button>
    <carousel :modelValue="currentSlideIndex" ref="carouselEl" :settings="settings" :style="{ marginLeft: `calc(-${gap}/2)`, marginRight: `calc(-${gap}/2)` }">
      <slide :class="{
        'carousel__slide__dynamic__height': props.dynamicHeight
      }" v-for="(child, index) of childrenRaw" :key="index" :style="{ padding: `0 calc(${gap}/2)` }">
        <component :is="child" />
      </slide>
      <template #addons>
        <Pagination v-if="props.navigationDots" :style="{ paddingLeft: `calc(${gap}/2)`, paddingRight: `calc(${gap}/2)` }"/>
      </template>
    </carousel>
    <button v-if="props.navigationArrows" class="hidden md:flex z-40 absolute top-1/2 right-0 trasform translate-x-1/2 bg-gray-100 rounded-full h-10 w-10 justify-center items-center" @click="next"><ArrowSmallRightIcon class="h-5 w-5" /></button>
  </div>
</template>
<style>
.carousel__slide--active {
  height: auto !important;
}
.carousel__slide__dynamic__height {
  height: 0;
}
.carousel__slide {
  @apply items-start;
}
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
