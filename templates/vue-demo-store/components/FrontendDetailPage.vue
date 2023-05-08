<script setup lang="ts">
import { useProductSearch } from "@shopware-pwa/composables-next";
import { getCategoryBreadcrumbs, getProductName } from "@shopware-pwa/helpers-next";

const props = defineProps<{
  navigationId: string;
}>();

const { search } = useProductSearch();

const { data: productResponse } = await useAsyncData(
  "cmsProduct" + props.navigationId,
  async () => {
    const productResponse = await search(props.navigationId, {
      withCmsAssociations: true,
    });
    return productResponse;
  }
);

const breadcrumbs = getCategoryBreadcrumbs(
  productResponse.value?.product.seoCategory,
  {
    startIndex: 2,
  }
);

breadcrumbs.push({
  name: getProductName({product: productResponse.value?.product}) || ''
})

useBreadcrumbs(breadcrumbs);

const { product } = useProduct(
  productResponse.value?.product,
  productResponse.value?.configurator
);

useCmsHead(product, { mainShopTitle: "Shopware Frontends Demo Store" });
</script>
<template>
  <template v-if="!product?.cmsPage">
    <div class="container mx-auto bg-white flex flex-col">
      <ProductStatic :product="product" />
    </div>
  </template>
  <template v-else-if="product.cmsPage">
    <CmsPage :content="product.cmsPage" />
  </template>
</template>
