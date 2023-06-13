<script setup lang="ts">
import {
  CmsElementImage,
  CmsElementManufacturerLogo,
  useCmsElementImage,
} from "@shopware-pwa/composables-next";
import { getPath } from '~/helpers';

const props = withDefaults(
  defineProps<{
    content: CmsElementImage | CmsElementManufacturerLogo;
    loading?: string;
  }>(),
  {
    loading: 'lazy',
  }
);

const {
  containerStyle,
  displayMode,
  imageContainerAttrs,
  imageAttrs,
  imageLink,
}: any = useCmsElementImage(props.content);
</script>
<template>
  <!-- TODO: using a tag only works with externalLink, need to improve this element to deal with both internalLink & externalLink -->
  <component
    v-if="imageAttrs.src"
    class="cms-element-image flex relative"
    :is="imageLink.url ? 'a' : 'div'"
    :style="containerStyle"
    v-bind="imageContainerAttrs"
  >
    <nuxt-img
      :class="{
        'h-full w-full': true,
        'absolute inset-0': ['cover', 'stretch'].includes(displayMode),
        'object-cover': displayMode === 'cover',
      }"
      :src="getPath(imageAttrs.src)"
      :alt="imageAttrs.alt || 'Image link'"
      :loading="props.loading"
    />
  </component>
</template>
