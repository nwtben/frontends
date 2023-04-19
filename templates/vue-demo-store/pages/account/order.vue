<script setup lang="ts">
import SharedAlert from '../../components/shared/SharedAlert.vue';
import SharedOrders from '../../components/shared/SharedOrders.vue';

definePageMeta({
  layout: "account",
});

const { orders, loadOrders } = useCustomerOrders();

useBreadcrumbs([
  {
    name: "Account Overview",
    path: "/account",
  },
  {
    name: "Order",
    path: "/account/order",
  },
]);

await useAsyncData("getOrders", () => {
  return loadOrders();
});
</script>

<script lang="ts">
export default {
  name: "OrderHistory",
};
</script>

<template>
  <section class="flex flex-col space-y-10 mb-24">
    <section>
      <h3 class="mb-4">Orders</h3>
      <p class="text-base">Your recent orders:</p>
    </section>
    <section>
      <SharedAlert v-if="!orders?.length" text="You currently have no order history." />
      <SharedOrders v-else :orders="orders || []" />
    </section>
  </section>
</template>
