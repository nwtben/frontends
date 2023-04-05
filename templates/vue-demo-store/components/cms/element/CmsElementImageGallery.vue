<script setup lang="ts">
import { CmsElementImageGallery } from "@shopware-pwa/composables-next";
import SwSlider from "../../SwSlider.vue";

const props = defineProps<{
  content: CmsElementImageGallery;
  slidesToShow?: number;
  slidesToScroll?: number;
}>();

const { getConfigValue } = useCmsElementConfig(props.content);

const currentSlideIndex = ref(0);
const imageThumbsTrack = ref();
const imageThumbsTrackStyle = ref({});
const imageThumbs = ref();
const imageThumbsStyle = ref({});
const mediaGallery = computed(() => props.content.data?.sliderItems ?? []);
const galleryPosition = computed<string>(
  () => getConfigValue("galleryPosition") ?? "left"
);
const navigationArrows = computed(
  () => getConfigValue("navigationArrows") as string ?? ''
);
const navigationDots = computed(
  () => getConfigValue("navigationDots") as string ?? ''
);

function changeCover(i: number) {
  if (i === currentSlideIndex.value) return;
  currentSlideIndex.value = i;
}
</script>

<template>
  <div
    :class="{
      'flex gap-3': true,
      'flex-col-reverse': galleryPosition === 'underneath',
    }"
  >
    <div
      :class="{
        'hidden lg:flex basis-20 relative flex-col items-center':
          galleryPosition === 'left',
        'flex relative w-full': galleryPosition === 'underneath',
      }"
    >
      <div
        class="overflow-hidden -my-2"
        ref="imageThumbs"
        :style="imageThumbsStyle"
      >
        <div
          :class="{
            'flex': true,
            'flex-col': galleryPosition === 'left',
          }"
          ref="imageThumbsTrack"
          :style="imageThumbsTrackStyle"
        >
          <div
            v-for="(image, i) in mediaGallery"
            :class="{
              'py-2': galleryPosition === 'left',
              'flex-1 px-2.5': galleryPosition === 'underneath',
            }"
            :key="image.media.url"
          >
            <div
              class="w-20 h-20 overflow-hidden cursor-pointer p-1 transition duration-150 ease-in-out"
              :class="{
                'border border-gray-500 border-3': i === currentSlideIndex,
              }"
            >
              <img
                :src="image.media.url"
                class="w-full h-full object-center object-cover"
                alt="Product image"
                @click="changeCover(i)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1 overflow-hidden">
      <SwSlider
        :currentSlideIndex="currentSlideIndex"
        :itemsToScroll="1"
        :itemsToShow="1"
        :navigationDots="navigationDots"
        :navigationArrows="navigationArrows"
        :mouseDrag="false"
        :touchDrag="false"
        :dynamicHeight="true"
      >
        <CmsElementImage
          v-for="image of mediaGallery"
          class="w-full"
          :key="image.media.url"
          :content="{ data: image, config: props.content.config } as any"
        />
      </SwSlider>
    </div>
  </div>
</template>
